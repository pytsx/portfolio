import { notFound } from "next/navigation"
import { Suspense } from "react"

import { BlockPage } from "@/components/block-page"
import { publicGroups } from "@/lib/groups"
import { publicPages } from "@/lib/pages"
import { resolvePageCollections } from "@/lib/pages/render"

async function ResolvedContent({ path }: { path: string[] }) {
  const [groups, pages] = await Promise.all([
    publicGroups.list(),
    publicPages.listAll(),
  ])
  let parentId: string | undefined
  let parentSlug: string | undefined

  for (const [index, segment] of path.entries()) {
    const group = groups.find(
      (candidate) => candidate.slug === segment && candidate.parentId === parentId,
    )
    const lastSegment = index === path.length - 1

    if (group) {
      if (lastSegment) {
        const collections = await resolvePageCollections(
          group.content,
          group.slug,
          group.id,
        )
        return <BlockPage title={group.title} content={group.content} collections={collections} />
      }
      parentId = group.id
      parentSlug = group.slug
      continue
    }

    if (lastSegment) {
      const page = pages.find(
        (candidate) =>
          candidate.slug === segment &&
          (candidate.groupId
            ? candidate.groupId === parentId
            : candidate.groupSlug
              ? candidate.groupSlug === parentSlug
              : parentId === undefined),
      )
      if (page) {
        const collections = await resolvePageCollections(
          page.content,
          undefined,
          page.groupId,
        )
        return <BlockPage title={page.title} content={page.content} collections={collections} width={page.width} />
      }
    }

    notFound()
  }

  notFound()
}

async function DynamicRoute({
  params,
}: {
  params: Promise<{ path: string[] }>
}) {
  const { path } = await params
  return <ResolvedContent path={path} />
}

export default function DynamicContentPage({
  params,
}: {
  params: Promise<{ path: string[] }>
}) {
  return (
    <Suspense fallback={<div className="min-h-96" />}>
      <DynamicRoute params={params} />
    </Suspense>
  )
}
