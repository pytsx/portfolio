"use client"

import Link from "next/link"
import { Editor, type EditorDocument } from "@/components/editor"

function ignoreDocumentChange() {}

type BlockPageProps = {
  title: string
  content: EditorDocument
  collections?: Record<number, PageCollectionItem[]>
}

export type PageCollectionItem = {
  id: string
  title: string
  href: string
  visibility: "public" | "private"
  isHome: boolean
}

function PageCollection({
  items,
  layout,
}: {
  items: PageCollectionItem[]
  layout: "grid" | "list"
}) {
  if (items.length === 0) {
    return <p className="py-8 text-sm text-muted-foreground">Nenhum item encontrado.</p>
  }

  return (
    <div className={layout === "grid" ? "grid gap-4 sm:grid-cols-2" : "grid gap-2"}>
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="rounded-2xl border p-5 text-lg font-medium transition-colors hover:bg-muted"
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}

export function BlockPage({ title, content, collections = {} }: BlockPageProps) {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <h1 className="mb-10 text-4xl font-bold tracking-tight sm:text-6xl">
        {title}
      </h1>
      <div className="space-y-6">
        {content.map((block, index) => {
          if (block.type === "pageCollection") {
            return (
              <PageCollection
                key={block.id ?? `collection-${index}`}
                items={collections[index] ?? []}
                layout={block.props?.layout === "list" ? "list" : "grid"}
              />
            )
          }

          return (
            <Editor
              key={block.id ?? `block-${index}`}
              value={[block]}
              onChange={ignoreDocumentChange}
              editable={false}
              className="text-base leading-8 sm:text-lg"
            />
          )
        })}
      </div>
    </article>
  )
}
