import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { collection, doc, getDoc, getDocs, query, type DocumentData, where } from "firebase/firestore"

import { cacheTags } from "@/lib/cache-tags"
import type { EditorDocument } from "@/components/editor/editor-types"
import { parseEditorDocument } from "@/components/editor/lib/document"
import { readDate } from "@/lib/entities/document"
import { db } from "@/lib/firebase/firebase"

const GROUPS_COLLECTION = "groups"

export type PageGroup = {
  id: string
  title: string
  slug: string
  content: EditorDocument
  visibility: "public" | "private"
  isHome: boolean
  parentId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type PublicGroupIndexItem = Omit<PageGroup, "content">

export type GroupInput = Pick<
  PageGroup,
  "title" | "slug" | "content" | "visibility" | "isHome" | "parentId"
>

export function groupFromDocument(id: string, data: DocumentData): PageGroup {
  return {
    id,
    title: typeof data.title === "string" ? data.title : "Grupo sem título",
    slug: typeof data.slug === "string" ? data.slug : id,
    content: parseEditorDocument(data.content),
    visibility: data.visibility === "private" ? "private" : "public",
    isHome: data.isHome === true,
    parentId: typeof data.parentId === "string" && data.parentId
      ? data.parentId
      : undefined,
    createdAt: readDate(data.createdAt),
    updatedAt: readDate(data.updatedAt),
  }
}

async function listPublicGroups(): Promise<PageGroup[]> {
  "use cache: remote"
  cacheLife("hours")
  cacheTag(cacheTags.groups)

  const snapshot = await getDocs(
    query(collection(db, GROUPS_COLLECTION), where("visibility", "==", "public")),
  )
  return snapshot.docs.map((document) => groupFromDocument(document.id, document.data()))
}

async function listPublicGroupIndex(): Promise<PublicGroupIndexItem[]> {
  "use cache: remote"
  cacheLife("hours")
  cacheTag(cacheTags.groups)

  const snapshot = await getDocs(
    query(collection(db, GROUPS_COLLECTION), where("visibility", "==", "public")),
  )
  return snapshot.docs.map((document) => {
    const group = groupFromDocument(document.id, document.data())
    return { id: group.id, title: group.title, slug: group.slug, visibility: group.visibility, isHome: group.isHome, parentId: group.parentId, createdAt: group.createdAt, updatedAt: group.updatedAt }
  })
}

async function getPublicGroupById(id: string): Promise<PageGroup | null> {
  "use cache: remote"
  cacheLife("hours")
  cacheTag(cacheTags.groups)

  const snapshot = await getDoc(doc(db, GROUPS_COLLECTION, id))
  if (!snapshot.exists()) return null
  const group = groupFromDocument(snapshot.id, snapshot.data())
  return group.visibility === "public" ? group : null
}

async function getPublicGroup(slug: string): Promise<PageGroup | null> {
  const groups = await listPublicGroups()
  return groups.find((group) => group.slug === slug) ?? null
}

export const publicGroups = {
  list: listPublicGroups,
  listIndex: listPublicGroupIndex,
  getById: getPublicGroupById,
  get: getPublicGroup,
  async getMain() {
    const groups = await listPublicGroups()
    return groups.find((group) => group.isHome) ?? null
  },
}
