import type { editorSchema } from "./editor-schema"
import type { PageWidth } from "@/lib/pages/page-width"

export type EditorDocument = Array<typeof editorSchema.PartialBlock>

export type EditorCollectionPage = {
  id: string
  title: string
  href: string
  visibility: "public" | "private"
  isHome: boolean
  groupId?: string
  groupSlug?: string
}

export type EditorCollectionGroup = {
  id: string
  title: string
  slug: string
  path: string
}

export type EditorCollectionData = {
  pages: EditorCollectionPage[]
  groups: EditorCollectionGroup[]
}

export interface EditorProps {
  value: EditorDocument
  onChange: (document: EditorDocument) => void
  placeholder?: string
  editable?: boolean
  autoFocus?: boolean
  className?: string
  onFocus?: () => void
  onBlur?: () => void
  onUpload?: (file: File) => Promise<string>
  onError?: (error: Error) => void
  collections?: EditorCollectionData
  mode?: "document" | "builder"
  pageWidth?: PageWidth
  pageId?: string
  pageTitle?: string
}
