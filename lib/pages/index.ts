import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  type DocumentData,
  where,
} from "firebase/firestore"

import type { EditorDocument } from "@/components/editor/editor-types"
import { parseEditorDocument } from "@/components/editor/lib/document"
import { cacheTags } from "@/lib/cache-tags"
import { readDate } from "@/lib/entities/document"
import { db } from "@/lib/firebase/firebase"
import { parsePageWidth, type PageWidth } from "@/lib/pages/page-width"

const PAGES_COLLECTION = "pages"
const PUBLIC_PAGE_INDEX_COLLECTION = "public-page-index"

export type PageVisibility = "public" | "private"

export type ContentPage = {
  id: string
  title: string
  slug: string
  content: EditorDocument
  visibility: PageVisibility
  isHome: boolean
  width: PageWidth
  description?: string
  coverImage?: string
  groupSlug?: string
  groupId?: string
  authorId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type PublicPageIndexItem = Omit<ContentPage, "content">

function pageIndexItem(page: ContentPage): PublicPageIndexItem {
  return {
    id: page.id, title: page.title, slug: page.slug, visibility: page.visibility,
    isHome: page.isHome, width: page.width, description: page.description,
    coverImage: page.coverImage, groupSlug: page.groupSlug, groupId: page.groupId,
    authorId: page.authorId, createdAt: page.createdAt, updatedAt: page.updatedAt,
  }
}

export type CreatePageInput = Pick<
  ContentPage,
  "title" | "slug" | "content" | "visibility" | "isHome" | "width" | "description" | "coverImage"
> & { groupSlug?: string; groupId?: string }

export type UpdatePageInput = CreatePageInput

export function pageFromDocument(
  id: string,
  data: DocumentData,
): ContentPage {
  return {
    id,
    title: typeof data.title === "string" ? data.title : "Sem título",
    slug: typeof data.slug === "string" ? data.slug : id,
    content: parseEditorDocument(data.content),
    visibility: data.visibility === "private" ? "private" : "public",
    isHome: data.isHome === true,
    width: parsePageWidth(data.width),
    description: typeof data.description === "string" && data.description.trim() ? data.description.trim() : undefined,
    coverImage: typeof data.coverImage === "string" && data.coverImage.trim() ? data.coverImage.trim() : undefined,
    groupSlug: typeof data.groupSlug === "string" && data.groupSlug
      ? data.groupSlug
      : undefined,
    groupId: typeof data.groupId === "string" && data.groupId
      ? data.groupId
      : undefined,
    authorId: typeof data.authorId === "string" ? data.authorId : undefined,
    createdAt: readDate(data.createdAt),
    updatedAt: readDate(data.updatedAt),
  }
}

async function listAllPublicPages(): Promise<ContentPage[]> {
  "use cache: remote"
  cacheLife("hours")
  cacheTag(cacheTags.pages)

  const snapshot = await getDocs(
    query(collection(db, PAGES_COLLECTION), where("visibility", "==", "public")),
  )
  return snapshot.docs.map((document) => pageFromDocument(document.id, document.data()))
}

async function listPublicPageIndex(): Promise<PublicPageIndexItem[]> {
  "use cache: remote"
  cacheLife("hours")
  cacheTag(cacheTags.pages)

  const snapshot = await getDocs(collection(db, PUBLIC_PAGE_INDEX_COLLECTION))
  if (snapshot.size > 0) {
    return snapshot.docs.map((document) => pageIndexItem(pageFromDocument(document.id, document.data())))
  }
  // Compatibilidade temporária para conteúdo criado antes da migração de índices.
  const legacy = await getDocs(query(collection(db, PAGES_COLLECTION), where("visibility", "==", "public")))
  return legacy.docs.map((document) => pageIndexItem(pageFromDocument(document.id, document.data())))
}

async function getPublicPageById(id: string): Promise<ContentPage | null> {
  "use cache: remote"
  cacheLife("hours")
  cacheTag(cacheTags.pages)

  const snapshot = await getDoc(doc(db, PAGES_COLLECTION, id))
  if (!snapshot.exists()) return null
  const page = pageFromDocument(snapshot.id, snapshot.data())
  return page.visibility === "public" ? page : null
}

async function getPublicPage(slug: string, groupSlug?: string): Promise<ContentPage | null> {
  const pages = await listAllPublicPages()
  return pages.find((page) => page.slug === slug && page.groupSlug === groupSlug) ?? null
}

async function listPublicPages(groupSlug: string): Promise<ContentPage[]> {
  const pages = await listAllPublicPages()
  return pages.filter((page) => page.groupSlug === groupSlug)
}

async function listPublicPagesByGroupId(groupId: string): Promise<ContentPage[]> {
  const pages = await listAllPublicPages()
  return pages.filter((page) => page.groupId === groupId)
}

async function getMainPublicPage(): Promise<ContentPage | null> {
  const pages = await listAllPublicPages()
  return pages.find((page) => page.isHome) ?? null
}

export const publicPages = {
  get: getPublicPage,
  list: listPublicPages,
  listAll: listAllPublicPages,
  listIndex: listPublicPageIndex,
  getById: getPublicPageById,
  listByGroupId: listPublicPagesByGroupId,
  getMain: getMainPublicPage,
}
