import { AdminEntityList } from "@/app/(protected)/admin/_src/entity-list"
import { AdminPageHeader } from "@/app/(protected)/admin/_src/page-header"
import { pageRepository } from "@/lib/pages/server"
import { deletePage } from "./actions"
import { Suspense } from "react"
import { connection } from "next/server"
import { AdminPageFallback } from "../_src/admin-page-fallback"
import { groupRepository } from "@/lib/groups/server"
import { getGroupPath } from "@/lib/groups/tree"
import { PageComposer } from "./_src/page-composer"
import { createPage } from "./actions"
import { createEditorCollectionData } from "@/lib/pages/editor-collections"

function getPagePath(page: Awaited<ReturnType<typeof pageRepository.list>>[number], groups: Awaited<ReturnType<typeof groupRepository.list>>) {
  const group = groups.find((candidate) =>
    page.groupId ? candidate.id === page.groupId : candidate.slug === page.groupSlug,
  )
  return `${group ? `${getGroupPath(group, groups)}/` : "/"}${page.slug}`
}

async function PagesContent({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; groupId?: string }>
}) {
  await connection()
  const [{ new: shouldCreate, groupId }, allPages, groups] = await Promise.all([
    searchParams,
    pageRepository.list(),
    groupRepository.list(),
  ])

  if (shouldCreate === "1") {
    return <PageComposer action={createPage} groups={groups} collections={createEditorCollectionData(allPages, groups)} defaultGroupId={groupId} />
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-8">
      <AdminPageHeader
        title="Páginas"
        description="Componha o portfólio usando documentos de blocos."
        createHref="/admin/pages?new=1"
        createLabel="Nova página"
      />
      <AdminEntityList
        items={allPages.map((page) => ({
          id: page.id,
          title: page.title,
          description: page.visibility === "public"
            ? getPagePath(page, groups)
            : `/admin/pages/${page.id}`,
          status: page.visibility === "public" ? "Pública" : "Privada",
        }))}
        editBasePath="/admin/pages"
        emptyTitle="Nenhuma página criada"
        emptyDescription="Crie a primeira página de blocos do portfólio."
        deleteAction={deletePage}
      />
    </div>
  )
}

export default function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; groupId?: string }>
}) {
  return <Suspense fallback={<AdminPageFallback />}><PagesContent searchParams={searchParams} /></Suspense>
}
