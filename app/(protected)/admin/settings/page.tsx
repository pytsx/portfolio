import { Suspense } from "react"
import { connection } from "next/server"

import { AdminPageFallback } from "@/app/(protected)/admin/_src/admin-page-fallback"
import { AdminPageHeader } from "@/app/(protected)/admin/_src/page-header"
import { MutationForm } from "@/app/(protected)/admin/_src/mutation-form"
import { AdminField } from "@/app/(protected)/admin/_src/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { publicSiteSettings } from "@/lib/site-settings"
import { saveSiteSettings } from "./actions"

async function SettingsContent() {
  await connection()
  const settings = await publicSiteSettings.get()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-8">
      <AdminPageHeader title="Configurações do portfólio" description="Defina a identidade usada no site público e nos metadados." />
      <MutationForm action={saveSiteSettings} title="Identidade do site" description="Estas informações aparecem nas áreas estáticas do portfólio." submitLabel="Salvar configurações">
        <AdminField label="Nome" htmlFor="name"><Input id="name" name="name" defaultValue={settings.name} required /></AdminField>
        <AdminField label="Descrição" htmlFor="description"><Textarea id="description" name="description" defaultValue={settings.description} /></AdminField>
        <AdminField label="Logo" htmlFor="logo" hint="Texto curto ou URL usada como identificação visual."><Input id="logo" name="logo" defaultValue={settings.logo} /></AdminField>
      </MutationForm>
    </div>
  )
}

export default function SettingsPage() {
  return <Suspense fallback={<AdminPageFallback />}><SettingsContent /></Suspense>
}
