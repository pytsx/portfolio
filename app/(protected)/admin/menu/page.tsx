import { AdminEntityList } from "@/app/(protected)/admin/_src/entity-list"
import { AdminPageHeader } from "@/app/(protected)/admin/_src/page-header"
import { menuRepository } from "@/lib/menu/server"
import { deleteMenuItem } from "./actions"
import { Suspense } from "react"
import { connection } from "next/server"
import { AdminPageFallback } from "../_src/admin-page-fallback"

async function MenuContent() {
  await connection()
  const items = await menuRepository.list()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-8">
      <AdminPageHeader
        title="Menus"
        description="Gerencie os menus e seus itens de navegação."
        createHref="/admin/menu/new"
        createLabel="Novo menu"
      />
      <AdminEntityList
        items={items.map((menu) => ({
          id: menu.id,
          title: menu.name,
          description: `${menu.items.length} itens`,
          status: menu.enabled ? "Visível" : "Oculto",
        }))}
        editBasePath="/admin/menu"
        emptyTitle="Nenhum menu criado"
        emptyDescription="Cadastre o primeiro menu da navegação."
        deleteAction={deleteMenuItem}
      />
    </div>
  )
}

export default function AdminMenuPage() {
  return <Suspense fallback={<AdminPageFallback />}><MenuContent /></Suspense>
}
