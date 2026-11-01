import "server-only"

import { cookies } from "next/headers"
import { initializeServerApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

import { SESSION_COOKIE_NAME } from "@/lib/auth/session"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function getFirebaseServer(idToken?: string) {
  const cookieStore = await cookies()
  const authIdToken = idToken ?? cookieStore.get(SESSION_COOKIE_NAME)?.value

  const serverApp = initializeServerApp(firebaseConfig, { authIdToken })
  const auth = getAuth(serverApp)

  await auth.authStateReady()

  return {
    auth,
    db: getFirestore(serverApp),
  }
}
