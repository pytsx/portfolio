import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import {
  collection,
  getDocs,
  type DocumentData,
} from "firebase/firestore"

import type { EditorDocument } from "@/components/editor/editor-types"
import { parseEditorDocument } from "@/components/editor/lib/document"
import { cacheTags } from "@/lib/cache-tags"
import { readDate } from "@/lib/entities/document"
import { db } from "@/lib/firebase/firebase"

const PAGES_COLLECTION = "pages"

export type PageVisibility = "public" | "private"

export type ContentPage = {
  id: string
  title: string
  slug: string
  content: EditorDocument
  visibility: PageVisibility
  isHome: boolean
  groupSlug?: string
  groupId?: string
  authorId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type CreatePageInput = Pick<
  ContentPage,
  "title" | "slug" | "content" | "visibility" | "isHome"
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
  "use cache"
  cacheLife("hours")
  cacheTag(cacheTags.pages)

  const snapshot = await getDocs(collection(db, PAGES_COLLECTION))
  return snapshot.docs
    .filter((document) => document.data().visibility !== "private")
    .map((document) => pageFromDocument(document.id, document.data()))
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
  listByGroupId: listPublicPagesByGroupId,
  getMain: getMainPublicPage,
}
