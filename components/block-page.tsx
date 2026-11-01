import { BlockRenderer, type BlockCollectionItem } from "@/components/block-renderer"
import type { EditorDocument } from "@/components/editor/editor-types"

type BlockPageProps = {
  title: string
  content: EditorDocument
  collections?: Record<number, PageCollectionItem[]>
}

export type PageCollectionItem = BlockCollectionItem

export async function BlockPage({ title, content, collections = {} }: BlockPageProps) {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <h1 className="mb-10 text-4xl font-bold tracking-tight sm:text-6xl">
        {title}
      </h1>
      <BlockRenderer content={content} collections={collections} />
    </article>
  )
}
