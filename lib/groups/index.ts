import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { collection, getDocs, type DocumentData } from "firebase/firestore"

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
  parentId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type GroupInput = Pick<PageGroup, "title" | "slug" | "content" | "parentId">

export function groupFromDocument(id: string, data: DocumentData): PageGroup {
  return {
    id,
    title: typeof data.title === "string" ? data.title : "Grupo sem título",
    slug: typeof data.slug === "string" ? data.slug : id,
    content: parseEditorDocument(data.content),
    parentId: typeof data.parentId === "string" && data.parentId
      ? data.parentId
      : undefined,
    createdAt: readDate(data.createdAt),
    updatedAt: readDate(data.updatedAt),
  }
}

async function listPublicGroups(): Promise<PageGroup[]> {
  "use cache"
  cacheLife("hours")
  cacheTag(cacheTags.groups)

  const snapshot = await getDocs(collection(db, GROUPS_COLLECTION))
  return snapshot.docs.map((document) => groupFromDocument(document.id, document.data()))
}

async function getPublicGroup(slug: string): Promise<PageGroup | null> {
  const groups = await listPublicGroups()
  return groups.find((group) => group.slug === slug) ?? null
}

export const publicGroups = {
  list: listPublicGroups,
  get: getPublicGroup,
}
