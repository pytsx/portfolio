import { notFound } from "next/navigation"

import { pageRepository } from "@/lib/pages/server"
import { PageComposer } from "../../_src/page-composer"
import { updatePage } from "../../actions"
import { groupRepository } from "@/lib/groups/server"
import { Suspense } from "react"
import { connection } from "next/server"
import { AdminPageFallback } from "../../../_src/admin-page-fallback"

async function EditPageContent({
  params,
}: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  const [page, groups] = await Promise.all([
    pageRepository.get(id),
    groupRepository.list(),
  ])

  if (!page) notFound()

  return (
    <PageComposer
      action={updatePage.bind(null, id)}
      page={page}
      groups={groups}
    />
  )
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<AdminPageFallback />}><EditPageContent params={params} /></Suspense>
}
