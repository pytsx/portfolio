"use server"

import { clearSessionCookie, setSessionCookie } from "@/cookies/auth"
import {
  getAuthenticatedContextForToken,
  getAuthenticatedUser,
  type AuthenticatedUser,
} from "@/lib/auth/server"

type EstablishSessionResult = { error?: string }

export async function establishSession(idToken: string): Promise<EstablishSessionResult> {
  if (typeof idToken !== "string" || !idToken.trim()) {
    return { error: "Não foi possível validar sua sessão." }
  }

  const context = await getAuthenticatedContextForToken(idToken)
  if (!context) {
    return { error: "Você não tem permissão para acessar a administração." }
  }

  await setSessionCookie(idToken)
  return {}
}

export async function endSession() {
  await clearSessionCookie()
}

export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  return getAuthenticatedUser()
}
