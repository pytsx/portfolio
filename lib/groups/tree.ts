import type { PageGroup } from "@/lib/groups"

export function getGroupPath(group: PageGroup, groups: PageGroup[]): string {
  const segments = [group.slug]
  const visited = new Set([group.id])
  let parentId = group.parentId

  while (parentId) {
    if (visited.has(parentId)) break
    visited.add(parentId)
    const parent = groups.find((candidate) => candidate.id === parentId)
    if (!parent) break
    segments.unshift(parent.slug)
    parentId = parent.parentId
  }

  return `/${segments.join("/")}`
}

export function getGroupDepth(group: PageGroup, groups: PageGroup[]): number {
  return getGroupPath(group, groups).split("/").filter(Boolean).length - 1
}
