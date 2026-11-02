"use client"

import { createContext, startTransition, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

import type { EditorDocument } from "./editor-types"

export type PageLayerNode = {
  id: string
  type: string
  label: string
  children: PageLayerNode[]
}

type PageStructure = {
  pageId: string
  pageTitle: string
  layers: PageLayerNode[]
}

type SelectionRequest = { blockId: string; version: number }

type PageStructureContextValue = {
  page?: PageStructure
  selectedBlockId?: string
  selectionRequest?: SelectionRequest
  publishPage: (pageId: string, pageTitle: string, document: EditorDocument) => void
  clearPage: (pageId: string) => void
  selectFromEditor: (blockId?: string) => void
  selectFromSidebar: (blockId: string) => void
}

const PageStructureContext = createContext<PageStructureContextValue | null>(null)

const BLOCK_LABELS: Record<string, string> = {
  paragraph: "Parágrafo",
  heading: "Título",
  bulletListItem: "Lista com marcadores",
  numberedListItem: "Lista numerada",
  checkListItem: "Checklist",
  quote: "Citação",
  divider: "Divisor",
  toggleListItem: "Lista recolhível",
  codeBlock: "Código",
  table: "Tabela",
  image: "Imagem",
  video: "Vídeo",
  audio: "Áudio",
  file: "Arquivo",
  callout: "Destaque",
  youtube: "YouTube",
  pageCollection: "Coleção de páginas",
  button: "Botão",
  section: "Seção",
  columns: "Colunas",
  column: "Coluna",
  stack: "Pilha",
  card: "Card",
}

export function createPageLayers(document: EditorDocument): PageLayerNode[] {
  return document.flatMap((block) => {
    if (!block.id || !block.type) return []
    return [{
      id: block.id,
      type: block.type,
      label: BLOCK_LABELS[block.type] ?? block.type,
      children: createPageLayers(block.children ?? []),
    }]
  })
}

function sameLayers(first: PageLayerNode[], second: PageLayerNode[]): boolean {
  if (first.length !== second.length) return false
  return first.every((layer, index) => {
    const other = second[index]
    return layer.id === other.id && layer.type === other.type && sameLayers(layer.children, other.children)
  })
}

export function PageStructureProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageStructure>()
  const [selectedBlockId, setSelectedBlockId] = useState<string>()
  const [selectionRequest, setSelectionRequest] = useState<SelectionRequest>()

  const publishPage = useCallback((pageId: string, pageTitle: string, document: EditorDocument) => {
    const layers = createPageLayers(document)
    startTransition(() => setPage((current) => (
      current?.pageId === pageId && current.pageTitle === pageTitle && sameLayers(current.layers, layers)
        ? current
        : { pageId, pageTitle, layers }
    )))
  }, [])

  const clearPage = useCallback((pageId: string) => {
    setPage((current) => current?.pageId === pageId ? undefined : current)
    setSelectedBlockId(undefined)
  }, [])

  const selectFromEditor = useCallback((blockId?: string) => setSelectedBlockId(blockId), [])
  const selectFromSidebar = useCallback((blockId: string) => {
    setSelectedBlockId(blockId)
    setSelectionRequest((current) => ({ blockId, version: (current?.version ?? 0) + 1 }))
  }, [])

  const value = useMemo<PageStructureContextValue>(() => ({
    page, selectedBlockId, selectionRequest,
    publishPage, clearPage, selectFromEditor, selectFromSidebar,
  }), [clearPage, page, publishPage, selectFromEditor, selectFromSidebar, selectedBlockId, selectionRequest])

  return <PageStructureContext.Provider value={value}>{children}</PageStructureContext.Provider>
}

export function usePageStructure() {
  const context = useContext(PageStructureContext)
  if (!context) throw new Error("usePageStructure deve ser usado dentro de PageStructureProvider.")
  return context
}
