import type { PublicGroupIndexItem } from "@/lib/groups"

/** Returns a route only when every ancestor is present in the public index. */
export function getPublicGroupPath(groupId: string, groups: PublicGroupIndexItem[]) {
  const byId = new Map(groups.map((group) => [group.id, group]))
  const segments: string[] = []
  const visited = new Set<string>()
  let current = byId.get(groupId)

  while (current) {
    if (visited.has(current.id)) return null
    visited.add(current.id)
    segments.unshift(current.slug)
    if (!current.parentId) return `/${segments.join("/")}`
    current = byId.get(current.parentId)
  }
  return null
}
