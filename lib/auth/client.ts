"use client"

import {
  inMemoryPersistence,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
} from "firebase/auth"

import { auth } from "@/lib/firebase/firebase"

export type ClientAuthenticatedUser = {
  id: string
  email: string | null
  name: string | null
  photoUrl: string | null
}

let persistenceSetup: Promise<void> | undefined

function setupInMemoryAuthPersistence() {
  persistenceSetup ??= setPersistence(auth, inMemoryPersistence)
  return persistenceSetup
}

export async function signIn(email: string, password: string) {
  await setupInMemoryAuthPersistence()
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user.getIdToken()
}

export async function signOutUser() {
  await setupInMemoryAuthPersistence()
  await signOut(auth)
}
