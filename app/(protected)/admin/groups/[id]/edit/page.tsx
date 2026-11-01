import { notFound } from "next/navigation"

import { groupRepository } from "@/lib/groups/server"
import { GroupComposer } from "../../_src/group-composer"
import { updateGroup } from "../../actions"
import { Suspense } from "react"
import { connection } from "next/server"
import { AdminPageFallback } from "../../../_src/admin-page-fallback"
import { pageRepository } from "@/lib/pages/server"
import { createEditorCollectionData } from "@/lib/pages/editor-collections"

async function EditGroupContent({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  const [group, groups, pages] = await Promise.all([
    groupRepository.get(id),
    groupRepository.list(),
    pageRepository.list(),
  ])
  if (!group) notFound()
  return <GroupComposer action={updateGroup.bind(null, id)} group={group} groups={groups} collections={createEditorCollectionData(pages, groups)} />
}

export default function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<AdminPageFallback />}><EditGroupContent params={params} /></Suspense>
}
