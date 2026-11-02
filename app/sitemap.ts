import type { MetadataRoute } from "next"
import { publicGroups } from "@/lib/groups"
import { publicPages } from "@/lib/pages"
import { absoluteUrl } from "@/lib/public/url"
import { getPublicGroupPath } from "@/lib/public/publication"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [groups, pages] = await Promise.all([publicGroups.listIndex(), publicPages.listIndex()])
  const groupPaths = new Map(groups.map((group) => [group.id, getPublicGroupPath(group.id, groups)]))
  const entries: MetadataRoute.Sitemap = [{ url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 }]
  for (const group of groups) {
    const path = getPublicGroupPath(group.id, groups)
    if (!group.isHome && path) entries.push({ url: absoluteUrl(path), lastModified: group.updatedAt, changeFrequency: "weekly", priority: 0.7 })
  }
  for (const page of pages) {
    if (page.isHome) continue
    const prefix = page.groupId ? groupPaths.get(page.groupId) : page.groupSlug ? `/${page.groupSlug}` : ""
    if (page.groupId && !prefix) continue
    entries.push({ url: absoluteUrl(`${prefix ?? ""}/${page.slug}`), lastModified: page.updatedAt, changeFrequency: "monthly", priority: 0.8 })
  }
  return entries
}
