import { notFound } from "next/navigation"

import { BlockPage } from "@/components/block-page"
import { pageRepository } from "@/lib/pages/server"
import { Suspense } from "react"
import { connection } from "next/server"
import { AdminPageFallback } from "../../_src/admin-page-fallback"

async function PrivatePageContent({
  params,
}: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  const page = await pageRepository.get(id)

  if (!page) notFound()

  return <BlockPage title={page.title} content={page.content} width={page.width} />
}

export default function PrivateBlockPage({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<AdminPageFallback />}><PrivatePageContent params={params} /></Suspense>
}
