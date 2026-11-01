import { notFound } from "next/navigation"
import { Suspense } from "react"

import { BlockPage } from "@/components/block-page"
import { publicPages } from "@/lib/pages"
import { publicGroups } from "@/lib/groups"
import { resolvePageCollections } from "@/lib/pages/render"

async function HomeContent() {
  const [page, group] = await Promise.all([
    publicPages.getMain(),
    publicGroups.getMain(),
  ])

  if (group) {
    const collections = await resolvePageCollections(group.content, group.slug, group.id)
    return <BlockPage title={group.title} content={group.content} collections={collections} />
  }

  if (!page) notFound()
  const collections = await resolvePageCollections(page.content)
  return <BlockPage title={page.title} content={page.content} collections={collections} width={page.width} />
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-96" aria-label="Carregando página" role="status" />}>
      <HomeContent />
    </Suspense>
  )
}
