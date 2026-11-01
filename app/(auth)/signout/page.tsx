"use client"

import Link from "next/link"
import { LogOut, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { endSession } from "@/lib/auth/actions"
import { signOutUser } from "@/lib/auth/client"

export default function SignOutPage() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function signOut() {
    setIsSigningOut(true)
    await Promise.all([endSession(), signOutUser()])
    router.replace("/")
    router.refresh()
  }

  return (
    <div className="grid gap-2">
      <CardHeader className="gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"><LogOut className="size-5" /></div>
        <div className="grid gap-1">
          <CardTitle className="text-xl">Encerrar sessão?</CardTitle>
          <CardDescription>Você será desconectado deste dispositivo.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /> O cookie de sessão seguro será removido imediatamente.
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-3">
        <Button variant="outline" render={<Link href="/" />}>Cancelar</Button>
        <Button variant="destructive" onClick={signOut} disabled={isSigningOut}>{isSigningOut ? "Saindo..." : "Sair"}</Button>
      </CardFooter>
    </div>
  )
}
