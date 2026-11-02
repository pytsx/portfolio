import "server-only"

import { cache } from "react"

import { groupRepository } from "@/lib/groups/server"
import { pageRepository } from "@/lib/pages/server"

export type SidebarGroup = {
  id: string
  title: string
  slug: string
  parentId?: string
}

export type SidebarPage = {
  id: string
  title: string
  slug: string
  groupId?: string
  groupSlug?: string
  isHome: boolean
}

export const getAdminNavigation = cache(async () => {
  const [groups, pages] = await Promise.all([
    groupRepository.list(),
    pageRepository.list(),
  ])

  return {
    groups: groups.map(({ id, title, slug, parentId }) => ({ id, title, slug, parentId })),
    pages: pages.map(({ id, title, slug, groupId, groupSlug, isHome }) => ({
      id, title, slug, groupId, groupSlug, isHome,
    })),
  }
})
