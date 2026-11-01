import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

type AdminPageHeaderProps = {
  title: string
  description: string
  createHref?: string
  createLabel?: string
}

export function AdminPageHeader({
  title,
  description,
  createHref,
  createLabel = "Novo registro",
}: AdminPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 pt-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {createHref ? (
        <Button render={<Link href={createHref} />}>
          <Plus data-icon="inline-start" />
          {createLabel}
        </Button>
      ) : null}
    </header>
  )
}
