type GroupTreeItem = { id: string; slug: string; parentId?: string }

export function getGroupPath<T extends GroupTreeItem>(group: T, groups: T[]): string {
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

export function getGroupDepth<T extends GroupTreeItem>(group: T, groups: T[]): number {
  return getGroupPath(group, groups).split("/").filter(Boolean).length - 1
}
