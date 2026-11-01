import { BlockRenderer, type BlockCollectionItem } from "@/components/block-renderer"
import type { EditorDocument } from "@/components/editor/editor-types"
import type { PageWidth } from "@/lib/pages/page-width"

type BlockPageProps = {
  title: string
  content: EditorDocument
  collections?: Record<string, PageCollectionItem[]>
  width?: PageWidth
}

export type PageCollectionItem = BlockCollectionItem

export async function BlockPage({ title, content, collections = {}, width = "wide" }: BlockPageProps) {
  return (
    <article className="w-full py-12 sm:py-20">
      <h1 className="sr-only">{title}</h1>
      <div className="page-width-frame" data-page-width={width}>
        <BlockRenderer content={content} collections={collections} />
      </div>
    </article>
  )
}
