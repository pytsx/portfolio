import { notFound } from "next/navigation"
import { connection } from "next/server"
import { Suspense } from "react"

import { BlockPage } from "@/components/block-page"
import { publicPages } from "@/lib/pages"
import { resolvePageCollections } from "@/lib/pages/render"

async function HomeContent() {
  await connection()
  const page = await publicPages.getMain()

  if (!page) notFound()

  const collections = await resolvePageCollections(page.content)
  return <BlockPage title={page.title} content={page.content} collections={collections} />
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-96" aria-label="Carregando página" role="status" />}>
      <HomeContent />
    </Suspense>
  )
}
