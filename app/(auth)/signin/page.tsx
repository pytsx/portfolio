"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { CredentialsForm } from "../_src/credentials-form"
import { establishSession } from "@/lib/auth/actions"
import { signIn, signOutUser } from "@/lib/auth/client"

function getSafeRedirect(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/admin"
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  async function submitSignIn(email: string, password: string) {
    const token = await signIn(email, password)
    const result = await establishSession(token)
    if (result.error) {
      await signOutUser()
      throw new Error(result.error)
    }

    router.replace(getSafeRedirect(searchParams.get("next")))
    router.refresh()
  }

  return (
    <CredentialsForm
      title="Bem-vindo de volta"
      description="Acesse com email e senha"
      submitLabel="Entrar"
      submitCredentials={submitSignIn}
    />
  )
}

export default function SignInPage() {
  return <Suspense fallback={<div className="min-h-80" aria-label="Carregando formulário" />}><SignInForm /></Suspense>
}
