import "server-only"

import { redirect } from "next/navigation"
import { cache } from "react"
import type { Firestore } from "firebase/firestore"

import { getFirebaseServer } from "@/lib/firebase/serverApp"

export type AuthenticatedUser = {
  id: string
  email: string | null
}

export type AuthenticatedContext = {
  db: Firestore
  user: AuthenticatedUser
}

function getAuthorizedEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLocaleLowerCase("pt-BR"))
      .filter(Boolean),
  )
}

function isAuthorizedAdministrator(email: string | null) {
  return email !== null && getAuthorizedEmails().has(email.toLocaleLowerCase("pt-BR"))
}

export const getAuthenticatedUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const context = await getAuthenticatedContext()
  return context?.user ?? null
})

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser()

  if (!user) redirect("/signin")

  return user
}

export const getAuthenticatedContext = cache(async (): Promise<AuthenticatedContext | null> => {
  return getAuthenticatedContextFromFirebase()
})

export async function getAuthenticatedContextForToken(
  idToken: string,
): Promise<AuthenticatedContext | null> {
  const { auth, db } = await getFirebaseServer(idToken)
  const user = auth.currentUser

  if (!user || !isAuthorizedAdministrator(user.email)) return null

  return {
    db,
    user: { id: user.uid, email: user.email },
  }
}

async function getAuthenticatedContextFromFirebase(): Promise<AuthenticatedContext | null> {
  const { auth, db } = await getFirebaseServer()
  const user = auth.currentUser

  if (!user || !isAuthorizedAdministrator(user.email)) return null

  return {
    db,
    user: { id: user.uid, email: user.email },
  }
}
