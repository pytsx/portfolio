import Link from "next/link"
import { FileText, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type AdminEntityListItem = {
  id: string
  title: string
  description: string
  status?: string
}

type AdminEntityListProps = {
  items: AdminEntityListItem[]
  editBasePath: string
  emptyTitle: string
  emptyDescription: string
  deleteAction(formData: FormData): Promise<void>
}

export function AdminEntityList({
  items,
  editBasePath,
  emptyTitle,
  emptyDescription,
  deleteAction,
}: AdminEntityListProps) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed text-center shadow-none">
        <CardContent className="flex flex-col items-center py-16">
          <FileText className="mb-4 size-9 text-muted-foreground" />
          <p className="font-medium">{emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id} className="shadow-none">
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <CardTitle className="truncate">{item.title}</CardTitle>
              <p className="truncate text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {item.status ? <Badge variant="secondary">{item.status}</Badge> : null}
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={`Editar ${item.title}`}
                render={<Link href={`${editBasePath}/${item.id}/edit`} />}
              >
                <Pencil />
              </Button>
              <form action={deleteAction}>
                <input type="hidden" name="id" value={item.id} />
                <Button
                  type="submit"
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`Excluir ${item.title}`}
                >
                  <Trash2 />
                </Button>
              </form>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
