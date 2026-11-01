import "server-only"

import type { EditorCollectionData } from "@/components/editor"
import type { PageGroup } from "@/lib/groups"
import { getGroupPath } from "@/lib/groups/tree"
import type { ContentPage } from "@/lib/pages"

export function createEditorCollectionData(
  pages: ContentPage[],
  groups: PageGroup[],
): EditorCollectionData {
  return {
    groups: groups.map((group) => ({
      id: group.id,
      title: group.title,
      path: getGroupPath(group, groups),
    })),
    pages: pages.map((page) => {
      const group = groups.find((candidate) => candidate.id === page.groupId)
      const path = group ? `${getGroupPath(group, groups)}/${page.slug}` : `/${page.slug}`

      return {
        id: page.id,
        title: page.title,
        href: page.visibility === "public" ? path : `/admin/pages/${page.id}/edit`,
        visibility: page.visibility,
        isHome: page.isHome,
        groupId: page.groupId,
      }
    }),
  }
}
