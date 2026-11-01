import { Suspense } from "react"
import { connection } from "next/server"

import { AdminEntityList } from "@/app/(protected)/admin/_src/entity-list"
import { AdminPageFallback } from "@/app/(protected)/admin/_src/admin-page-fallback"
import { AdminPageHeader } from "@/app/(protected)/admin/_src/page-header"
import { MutationForm } from "@/app/(protected)/admin/_src/mutation-form"
import { socialRepository } from "@/lib/socials/server"
import { SocialFields } from "./_src/social-fields"
import { createSocial, deleteSocial } from "./actions"

async function SocialsContent({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  await connection()
  const [{ new: shouldCreate }, socials] = await Promise.all([
    searchParams,
    socialRepository.list(),
  ])

  if (shouldCreate === "1") {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-8">
        <AdminPageHeader title="Nova rede social" description="Adicione um link ao footer público." />
        <MutationForm action={createSocial} title="Rede social" description="Defina o nome, endereço e visibilidade." submitLabel="Criar rede social">
          <SocialFields />
        </MutationForm>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-8">
      <AdminPageHeader title="Redes sociais" description="Gerencie os links exibidos no footer público." createHref="/admin/socials?new=1" createLabel="Nova rede social" />
      <AdminEntityList
        items={socials.map((social) => ({
          id: social.id,
          title: social.name,
          description: social.href,
          status: social.visible ? "Visível" : "Oculta",
        }))}
        editBasePath="/admin/socials"
        emptyTitle="Nenhuma rede social criada"
        emptyDescription="Adicione o primeiro link para o footer público."
        deleteAction={deleteSocial}
      />
    </div>
  )
}

export default function AdminSocialsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  return <Suspense fallback={<AdminPageFallback />}><SocialsContent searchParams={searchParams} /></Suspense>
}
