import "server-only"

import { createSlug } from "@/lib/entities/document"
import { EntityUnauthorizedError, EntityValidationError } from "@/lib/entities/errors"
import { createAuthenticatedRepository } from "@/lib/firebase/authenticated-repository"
import { getAuthenticatedContext } from "@/lib/auth/server"
import { groupFromDocument, type GroupInput, type PageGroup } from "@/lib/groups"
import { getEditorDocumentText } from "@/components/editor/lib/document"
import { clearOtherHomeDocuments } from "@/lib/entities/home"
import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from "firebase/firestore"

function validateGroup(input: GroupInput): GroupInput {
  const title = input.title.trim()
  const slug = createSlug(input.slug.trim() || title)

  if (!title || !slug) {
    throw new EntityValidationError("Informe um nome e um endereço válidos para o grupo.")
  }

  if (!getEditorDocumentText(input.content).trim()) {
    throw new EntityValidationError("O grupo precisa ter algum conteúdo.")
  }

  return {
    title,
    slug,
    content: input.content,
    visibility: input.isHome ? "public" : input.visibility === "private" ? "private" : "public",
    isHome: input.isHome === true,
    ...(input.parentId?.trim() ? { parentId: input.parentId.trim() } : {}),
  }
}

const baseGroupRepository = createAuthenticatedRepository<
  PageGroup,
  GroupInput,
  GroupInput
>({
  collectionName: "groups",
  fromDocument: groupFromDocument,
  serializeCreate: (input) => validateGroup(input),
  serializeUpdate: validateGroup,
})

async function syncPublicGroupIndex(group: PageGroup) {
  const context = await getAuthenticatedContext()
  if (!context) return
  const reference = doc(context.db, "public-group-index", group.id)
  if (group.visibility !== "public") return deleteDoc(reference)
  await setDoc(reference, {
    title: group.title, slug: group.slug, visibility: group.visibility, isHome: group.isHome,
    parentId: group.parentId ?? "", updatedAt: new Date(),
  })
}

export const groupRepository = {
  async create(input: GroupInput) {
    const group = await baseGroupRepository.create(input)
    await syncPublicGroupIndex(group)
    if (group.isHome) {
      await clearOtherHomeDocuments("groups", group.id)
      await this.migratePublicIndex()
    }
    return group
  },
  list: baseGroupRepository.list,
  get: baseGroupRepository.get,
  async delete(id: string) {
    await baseGroupRepository.delete(id)
    const context = await getAuthenticatedContext()
    if (context) await deleteDoc(doc(context.db, "public-group-index", id))
  },
  async update(id: string, input: GroupInput) {
    const group = await baseGroupRepository.get(id)
    const updatedGroup = await baseGroupRepository.update(id, {
      ...input,
      slug: group?.slug ?? input.slug,
    })
    await syncPublicGroupIndex(updatedGroup)
    if (updatedGroup.isHome) {
      await clearOtherHomeDocuments("groups", id)
      await this.migratePublicIndex()
    }
    return updatedGroup
  },
  async migrateLegacyVisibility() {
    const context = await getAuthenticatedContext()
    if (!context) {
      throw new EntityUnauthorizedError("Sua sessão expirou. Entre novamente.")
    }

    const snapshot = await getDocs(collection(context.db, "groups"))
    const legacyDocuments = snapshot.docs.filter(
      (document) => typeof document.data().visibility !== "string",
    )

    for (let index = 0; index < legacyDocuments.length; index += 500) {
      const batch = writeBatch(context.db)
      legacyDocuments
        .slice(index, index + 500)
        .forEach((document) => batch.update(document.ref, { visibility: "public" }))
      await batch.commit()
    }

    return legacyDocuments.length
  },
  async migratePublicIndex() {
    const groups = await baseGroupRepository.list()
    await Promise.all(groups.map(syncPublicGroupIndex))
    return groups.length
  },
}
