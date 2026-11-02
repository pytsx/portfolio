type CollectionPage = { groupId?: string; groupSlug?: string }
type CollectionGroup = { id: string; slug: string }

export function pageBelongsToCollection(
  page: CollectionPage,
  groupId: string,
  groups: CollectionGroup[],
) {
  if (!groupId) return true
  if (page.groupId) return page.groupId === groupId
  const selectedGroup = groups.find((group) => group.id === groupId)
  return Boolean(selectedGroup && page.groupSlug === selectedGroup.slug)
}
