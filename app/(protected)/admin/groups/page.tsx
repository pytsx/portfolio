import { AdminEntityList } from "@/app/(protected)/admin/_src/entity-list"
import { AdminPageHeader } from "@/app/(protected)/admin/_src/page-header"
import { groupRepository } from "@/lib/groups/server"
import { deleteGroup } from "./actions"
import { Suspense } from "react"
import { connection } from "next/server"
import { AdminPageFallback } from "../_src/admin-page-fallback"
import { getGroupPath } from "@/lib/groups/tree"
import { GroupComposer } from "./_src/group-composer"
import { createGroup } from "./actions"
import { pageRepository } from "@/lib/pages/server"
import { createEditorCollectionData } from "@/lib/pages/editor-collections"

async function GroupsContent({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; parentId?: string }>
}) {
  await connection()
  const [{ new: shouldCreate, parentId }, groups, pages] = await Promise.all([
    searchParams,
    groupRepository.list(),
    pageRepository.list(),
  ])
  if (shouldCreate === "1") {
    return <GroupComposer action={createGroup} groups={groups} defaultParentId={parentId} collections={createEditorCollectionData(pages, groups)} />
  }
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-8">
      <AdminPageHeader title="Grupos" description="Organize páginas em coleções e rotas." createHref="/admin/groups?new=1" createLabel="Novo grupo" />
      <AdminEntityList
        items={groups.map((group) => ({
          id: group.id,
          title: group.title,
          description: getGroupPath(group, groups),
          status: group.visibility === "public" ? "Público" : "Privado",
        }))}
        editBasePath="/admin/groups"
        emptyTitle="Nenhum grupo criado"
        emptyDescription="Crie um grupo como blog, projetos ou documentação."
        deleteAction={deleteGroup}
      />
    </div>
  )
}

export default function AdminGroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; parentId?: string }>
}) {
  return <Suspense fallback={<AdminPageFallback />}><GroupsContent searchParams={searchParams} /></Suspense>
}
