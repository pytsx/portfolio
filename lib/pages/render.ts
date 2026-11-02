import "server-only"

import type { PageCollectionItem } from "@/components/block-page"
import type { EditorDocument } from "@/components/editor/editor-types"
import { publicGroups } from "@/lib/groups"
import { getPublicGroupPath } from "@/lib/public/publication"
import { publicPages } from "@/lib/pages"
import { pageBelongsToCollection } from "./collection-membership"

export async function resolvePageCollections(
  document: EditorDocument,
  defaultGroupPath?: string,
  defaultGroupId?: string,
): Promise<Record<string, PageCollectionItem[]>> {
  function hasPageCollection(blocks: EditorDocument): boolean {
    return blocks.some((block) => block.type === "pageCollection" || (block.children?.length ? hasPageCollection(block.children) : false))
  }

  if (!hasPageCollection(document)) return {}

  const [allPages, groups] = await Promise.all([
    publicPages.listIndex(),
    publicGroups.listIndex(),
  ])
  const groupPaths = new Map(
    groups.map((group) => [group.id, getPublicGroupPath(group.id, groups)]),
  )

  const entries: Array<readonly [string, PageCollectionItem[]]> = []

  function visit(blocks: EditorDocument, parentPath = "") {
    blocks.forEach((block, index) => {
      const path = parentPath ? `${parentPath}.${index}` : String(index)

      if (block.type === "pageCollection") {
        const groupId = block.props?.groupId || defaultGroupId
        const query = (block.props?.query ?? "").trim().toLocaleLowerCase("pt-BR")
        const limit = Math.max(1, Math.min(block.props?.limit ?? 6, 50))
        const items = allPages
          .filter((page) => pageBelongsToCollection(page, groupId ?? "", groups))
          .filter((page) => !page.groupId || Boolean(groupPaths.get(page.groupId)))
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

        entries.push([block.id ?? path, items])
      }

      if (block.children?.length) visit(block.children, path)
    })
  }

  visit(document)

  return Object.fromEntries(entries)
}
