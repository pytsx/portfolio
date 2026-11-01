import { MenuFields } from "@/app/(protected)/admin/_src/menu-fields"
import { MutationForm } from "@/app/(protected)/admin/_src/mutation-form"
import { AdminPageHeader } from "@/app/(protected)/admin/_src/page-header"
import { createMenuItem } from "../actions"
import { Suspense } from "react"
import { connection } from "next/server"
import { AdminPageFallback } from "../../_src/admin-page-fallback"

async function NewMenuContent() {
  await connection()
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-8">
      <AdminPageHeader title="Novo menu" description="Monte a navegação com links e dropdowns." />
      <MutationForm
        action={createMenuItem}
        title="Dados do menu"
        description="Adicione e ordene os itens que farão parte deste menu."
        submitLabel="Criar menu"
      >
        <MenuFields />
      </MutationForm>
    </div>
  )
}

export default function NewMenuItemPage() {
  return <Suspense fallback={<AdminPageFallback />}><NewMenuContent /></Suspense>
}
