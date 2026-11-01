import { BlockRenderer, type BlockCollectionItem } from "@/components/block-renderer"
import type { EditorDocument } from "@/components/editor/editor-types"

type BlockPageProps = {
  title: string
  content: EditorDocument
  collections?: Record<string, PageCollectionItem[]>
}

export type PageCollectionItem = BlockCollectionItem

export async function BlockPage({ title, content, collections = {} }: BlockPageProps) {
  return (
    <article className="w-full py-12 sm:py-20">
      <h1 className="sr-only">{title}</h1>
      <BlockRenderer content={content} collections={collections} />
    </article>
  )
}
