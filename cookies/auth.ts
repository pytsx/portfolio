"use server"

import { cookies } from "next/headers"

import { SESSION_COOKIE_NAME, SESSION_DURATION_IN_SECONDS } from "@/lib/auth/session"

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, idToken, {
    maxAge: SESSION_DURATION_IN_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    priority: "high",
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
