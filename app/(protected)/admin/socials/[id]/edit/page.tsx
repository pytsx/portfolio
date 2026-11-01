import { notFound } from "next/navigation"
import { Suspense } from "react"
import { connection } from "next/server"

import { AdminPageFallback } from "@/app/(protected)/admin/_src/admin-page-fallback"
import { AdminPageHeader } from "@/app/(protected)/admin/_src/page-header"
import { MutationForm } from "@/app/(protected)/admin/_src/mutation-form"
import { socialRepository } from "@/lib/socials/server"
import { SocialFields } from "../../_src/social-fields"
import { updateSocial } from "../../actions"

async function EditSocialContent({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  const social = await socialRepository.get(id)
  if (!social) notFound()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-8">
      <AdminPageHeader title="Editar rede social" description="Atualize o link e a visibilidade." />
      <MutationForm action={updateSocial.bind(null, id)} title="Rede social" description="As alterações refletem no footer público." submitLabel="Salvar alterações">
        <SocialFields social={social} />
      </MutationForm>
    </div>
  )
}

export default function EditSocialPage({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<AdminPageFallback />}><EditSocialContent params={params} /></Suspense>
}
