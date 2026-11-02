import "server-only"

import { getEditorDocumentText } from "@/components/editor/lib/document"
import { createSlug } from "@/lib/entities/document"
import { EntityValidationError } from "@/lib/entities/errors"
import { createAuthenticatedRepository } from "@/lib/firebase/authenticated-repository"
import { clearOtherHomeDocuments } from "@/lib/entities/home"
import {
  pageFromDocument,
  type ContentPage,
  type CreatePageInput,
  type UpdatePageInput,
} from "@/lib/pages"
import { parsePageWidth } from "@/lib/pages/page-width"
import { deleteDoc, doc, setDoc } from "firebase/firestore"
import { getAuthenticatedContext } from "@/lib/auth/server"

const PAGES_COLLECTION = "pages"

function validatePage(input: CreatePageInput): CreatePageInput {
  const title = input.title.trim()
  const slug = createSlug(input.slug.trim() || title)

  if (!title) {
    throw new EntityValidationError("Informe o título da página.")
  }

  if (!slug) {
    throw new EntityValidationError("Informe um endereço válido para a página.")
  }

  if (!getEditorDocumentText(input.content).trim()) {
    throw new EntityValidationError("A página precisa ter algum conteúdo.")
  }

  return {
    title,
    slug,
    content: input.content,
    visibility: input.isHome ? "public" : input.visibility === "private" ? "private" : "public",
    isHome: input.isHome === true,
    width: parsePageWidth(input.width),
    description: input.description?.trim() ?? "",
    coverImage: input.coverImage?.trim() ?? "",
    ...(input.groupSlug?.trim() ? { groupSlug: input.groupSlug.trim() } : {}),
    ...(input.groupId?.trim() ? { groupId: input.groupId.trim() } : {}),
  }
}

const basePageRepository = createAuthenticatedRepository<
  ContentPage,
  CreatePageInput,
  UpdatePageInput
>({
  collectionName: PAGES_COLLECTION,
  fromDocument: pageFromDocument,
  getDocumentId: (input) => {
    const page = validatePage(input)
    return page.groupId ? `${page.groupId}--${page.slug}` : page.slug
  },
  serializeCreate: (input, userId) => ({
    ...validatePage(input),
    authorId: userId,
  }),
  serializeUpdate: validatePage,
})

async function clearOtherHomePages(pageId: string) {
  await clearOtherHomeDocuments("pages", pageId)
}

async function syncPublicPageIndex(page: ContentPage) {
  const context = await getAuthenticatedContext()
  if (!context) return
  const reference = doc(context.db, "public-page-index", page.id)
  if (page.visibility !== "public") return deleteDoc(reference)
  await setDoc(reference, {
    title: page.title, slug: page.slug, visibility: page.visibility, isHome: page.isHome,
    width: page.width, description: page.description ?? "", coverImage: page.coverImage ?? "",
    groupSlug: page.groupSlug ?? "", groupId: page.groupId ?? "", updatedAt: new Date(),
  })
}

export const pageRepository = {
  async create(input: CreatePageInput) {
    const page = await basePageRepository.create(input)
    await syncPublicPageIndex(page)
    if (page.isHome) {
      await clearOtherHomePages(page.id)
      await this.migratePublicIndex()
    }
    return page
  },
  list: basePageRepository.list,
  get: basePageRepository.get,
  async delete(id: string) {
    await basePageRepository.delete(id)
    const context = await getAuthenticatedContext()
    if (context) await deleteDoc(doc(context.db, "public-page-index", id))
  },
  async update(id: string, input: UpdatePageInput) {
    const existingPage = await basePageRepository.get(id)

    const page = await basePageRepository.update(id, {
      ...input,
      slug: existingPage?.slug ?? input.slug,
    })
    await syncPublicPageIndex(page)
    if (page.isHome) {
      await clearOtherHomePages(page.id)
      await this.migratePublicIndex()
    }
    return page
  },
  async migratePublicIndex() {
    const pages = await basePageRepository.list()
    await Promise.all(pages.map(syncPublicPageIndex))
    return pages.length
  },
}
