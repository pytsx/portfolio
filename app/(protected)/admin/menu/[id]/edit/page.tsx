import { notFound } from "next/navigation"

import { MenuFields } from "@/app/(protected)/admin/_src/menu-fields"
import { MutationForm } from "@/app/(protected)/admin/_src/mutation-form"
import { AdminPageHeader } from "@/app/(protected)/admin/_src/page-header"
import { menuRepository } from "@/lib/menu/server"
import { updateMenuItem } from "../../actions"
import { Suspense } from "react"
import { connection } from "next/server"
import { AdminPageFallback } from "../../../_src/admin-page-fallback"

async function EditMenuContent({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  const menu = await menuRepository.get(id)

  if (!menu) notFound()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-8">
      <AdminPageHeader title="Editar menu" description="Atualize a navegação e seus itens." />
      <MutationForm
        action={updateMenuItem.bind(null, id)}
        title="Dados do menu"
        description="Revise os dados antes de salvar."
        submitLabel="Salvar alterações"
      >
        <MenuFields menu={menu} />
      </MutationForm>
    </div>
  )
}

export default function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<AdminPageFallback />}><EditMenuContent params={params} /></Suspense>
}
