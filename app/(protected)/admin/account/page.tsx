import { Suspense } from "react"
import { connection } from "next/server"
import { CircleUserRound, Mail } from "lucide-react"

import { AdminPageFallback } from "../_src/admin-page-fallback"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuthenticatedUser } from "@/lib/auth/server"

async function AccountContent() {
  await connection()
  const user = await requireAuthenticatedUser()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-16 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Minha conta</h1>
        <p className="mt-2 text-muted-foreground">Informações da sessão administrativa.</p>
      </header>
      <Card className="shadow-none">
        <CardHeader><CardTitle>Perfil</CardTitle></CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <div className="flex items-center gap-3"><Mail className="size-4 text-muted-foreground" /><span>{user.email ?? "E-mail não informado"}</span></div>
          <div className="flex items-center gap-3"><CircleUserRound className="size-4 text-muted-foreground" /><span className="truncate">{user.id}</span></div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AccountPage() {
  return <Suspense fallback={<AdminPageFallback />}><AccountContent /></Suspense>
}
