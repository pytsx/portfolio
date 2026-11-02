import { notFound } from "next/navigation"

import { pageRepository } from "@/lib/pages/server"
import { PageComposer } from "../../_src/page-composer"
import { updatePage } from "../../actions"
import { groupRepository } from "@/lib/groups/server"
import { Suspense } from "react"
import { connection } from "next/server"
import { AdminPageFallback } from "../../../_src/admin-page-fallback"
import { createEditorCollectionData } from "@/lib/pages/editor-collections"

async function EditPageContent({
  params,
}: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  const [page, pages, groups] = await Promise.all([
    pageRepository.get(id),
    pageRepository.list(),
    groupRepository.list(),
  ])

  if (!page) notFound()

  return (
    <PageComposer
      action={updatePage.bind(null, id)}
      page={page}
      groups={groups}
      collections={createEditorCollectionData(pages, groups)}
    />
  )
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<AdminPageFallback />}><EditPageContent params={params} /></Suspense>
}
