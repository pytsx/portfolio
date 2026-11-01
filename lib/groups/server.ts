import "server-only"

import { createSlug } from "@/lib/entities/document"
import { EntityValidationError } from "@/lib/entities/errors"
import { createAuthenticatedRepository } from "@/lib/firebase/authenticated-repository"
import { groupFromDocument, type GroupInput, type PageGroup } from "@/lib/groups"
import { getEditorDocumentText } from "@/components/editor/lib/document"
import { clearOtherHomeDocuments } from "@/lib/entities/home"

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

export const groupRepository = {
  async create(input: GroupInput) {
    const group = await baseGroupRepository.create(input)
    if (group.isHome) await clearOtherHomeDocuments("groups", group.id)
    return group
  },
  list: baseGroupRepository.list,
  get: baseGroupRepository.get,
  delete: baseGroupRepository.delete,
  async update(id: string, input: GroupInput) {
    const group = await baseGroupRepository.get(id)
    const updatedGroup = await baseGroupRepository.update(id, {
      ...input,
      slug: group?.slug ?? input.slug,
    })
    if (updatedGroup.isHome) await clearOtherHomeDocuments("groups", id)
    return updatedGroup
  },
}
