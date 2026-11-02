import "server-only"

import { cache } from "react"

import { publicGroups, type PageGroup } from "@/lib/groups"
import { publicPages, type ContentPage } from "@/lib/pages"

export type ResolvedPublicRoute =
  | { kind: "group"; path: string; entity: PageGroup }
  | { kind: "page"; path: string; entity: ContentPage }

export const resolvePublicRoute = cache(async (pathname: string): Promise<ResolvedPublicRoute | null> => {
  const segments = pathname.split("/").filter(Boolean)
  if (!segments.length) return null

  const [groups, pages] = await Promise.all([
    publicGroups.listIndex(),
    publicPages.listIndex(),
  ])
  let parentId: string | undefined
  let parentSlug: string | undefined

  for (const [index, segment] of segments.entries()) {
    const group = groups.find(
      (candidate) => candidate.slug === segment && candidate.parentId === parentId,
    )
    const last = index === segments.length - 1

    if (group) {
      if (last) {
        const entity = await publicGroups.getById(group.id)
        return entity ? { kind: "group", path: `/${segments.join("/")}`, entity } : null
      }
      parentId = group.id
      parentSlug = group.slug
      continue
    }

    if (!last) return null
    const page = pages.find(
      (candidate) => candidate.slug === segment &&
        (candidate.groupId ? candidate.groupId === parentId : candidate.groupSlug ? candidate.groupSlug === parentSlug : parentId === undefined),
    )
    if (!page) return null
    const entity = await publicPages.getById(page.id)
    return entity ? { kind: "page", path: `/${segments.join("/")}`, entity } : null
  }

  return null
})
