import "server-only"

import { getEditorDocumentText } from "@/components/editor/lib/document"
import { createSlug } from "@/lib/entities/document"
import { EntityValidationError } from "@/lib/entities/errors"
import { createAuthenticatedRepository } from "@/lib/firebase/authenticated-repository"
import { getAuthenticatedContext } from "@/lib/auth/server"
import { collection, getDocs, query, where, writeBatch } from "firebase/firestore"
import {
  pageFromDocument,
  type ContentPage,
  type CreatePageInput,
  type UpdatePageInput,
} from "@/lib/pages"

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
  const context = await getAuthenticatedContext()
  if (!context) return

  const pagesQuery = query(
    collection(context.db, PAGES_COLLECTION),
    where("isHome", "==", true),
  )

  const pages = await getDocs(pagesQuery)
  const batch = writeBatch(context.db)
  pages.docs
    .filter((page) => page.id !== pageId)
    .forEach((page) => batch.update(page.ref, { isHome: false }))

  await batch.commit()
}

export const pageRepository = {
  async create(input: CreatePageInput) {
    const page = await basePageRepository.create(input)
    if (page.isHome) await clearOtherHomePages(page.id)
    return page
  },
  list: basePageRepository.list,
  get: basePageRepository.get,
  delete: basePageRepository.delete,
  async update(id: string, input: UpdatePageInput) {
    const existingPage = await basePageRepository.get(id)

    const page = await basePageRepository.update(id, {
      ...input,
      slug: existingPage?.slug ?? input.slug,
    })
    if (page.isHome) await clearOtherHomePages(page.id)
    return page
  },
}
