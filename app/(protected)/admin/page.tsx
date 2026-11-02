import Link from "next/link"
import { FolderTree, PanelsTopLeft, Plus } from "lucide-react"
import { Suspense } from "react"
import { connection } from "next/server"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdminNavigation } from "@/lib/admin/navigation"
import { AdminPageFallback } from "./_src/admin-page-fallback"

async function AdminContent() {
  await connection()
  const { pages, groups } = await getAdminNavigation()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-16 sm:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Conteúdo</h1>
          <p className="mt-2 text-muted-foreground">Um motor de páginas organizado por grupos.</p>
        </div>
        <Button render={<Link href="/admin/pages?new=1" />}>
          <Plus data-icon="inline-start" /> Nova página
        </Button>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription className="flex items-center gap-2"><PanelsTopLeft className="size-4" /> Páginas</CardDescription>
            <CardTitle className="text-3xl">{pages.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription className="flex items-center gap-2"><FolderTree className="size-4" /> Grupos</CardDescription>
            <CardTitle className="text-3xl">{groups.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return <Suspense fallback={<AdminPageFallback />}><AdminContent /></Suspense>
}
