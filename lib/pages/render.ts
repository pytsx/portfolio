import "server-only"

import type { PageCollectionItem } from "@/components/block-page"
import type { EditorDocument } from "@/components/editor/editor-types"
import { publicGroups } from "@/lib/groups"
import { getGroupPath } from "@/lib/groups/tree"
import { publicPages } from "@/lib/pages"

export async function resolvePageCollections(
  document: EditorDocument,
  defaultGroupPath?: string,
  defaultGroupId?: string,
): Promise<Record<number, PageCollectionItem[]>> {
  const [allPages, groups] = await Promise.all([
    publicPages.listAll(),
    publicGroups.list(),
  ])
  const groupPaths = new Map(
    groups.map((group) => [group.id, getGroupPath(group, groups)]),
  )

  const entries = document.map((block, index) => {
    if (block.type !== "pageCollection") return null

    const groupId = block.props?.groupId || defaultGroupId
    const query = (block.props?.query ?? "").trim().toLocaleLowerCase("pt-BR")
    const limit = Math.max(1, Math.min(block.props?.limit ?? 6, 50))
    const items = allPages
      .filter((page) => !groupId || page.groupId === groupId)
      .filter((page) => block.props?.visibility === "all" || page.visibility === block.props?.visibility)
      .filter((page) => !block.props?.homeOnly || page.isHome)
      .filter((page) => !query || page.title.toLocaleLowerCase("pt-BR").includes(query))
      .slice(0, limit)
      .map((page) => ({
        id: page.id,
        title: page.title,
        href: page.groupId
          ? `${groupPaths.get(page.groupId) ?? defaultGroupPath ?? ""}/${page.slug}`
          : `/${page.slug}`,
        visibility: page.visibility,
        isHome: page.isHome,
      }))

    return [index, items] as const
  })

  return Object.fromEntries(entries.filter((entry) => entry !== null))
}
