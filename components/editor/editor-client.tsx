"use client"

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { syntaxHighlighter } from "@blocknote/code-block"
import { pt } from "@blocknote/core/locales"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/shadcn"
import { useTheme } from "next-themes"
import { Monitor, Smartphone, Tablet } from "lucide-react"

import { cn } from "@/lib/utils"
import { EditorSlashMenu } from "./components/slash-menu"
import { PageCollectionProvider } from "./components/page-collection-context"
import { BlockInspector } from "./components/block-inspector"
import { editorSchema } from "./editor-schema"
import type { EditorDocument, EditorProps } from "./editor-types"
import { areEditorDocumentsEqual, normalizeEditorDocument } from "./lib/document"
import { usePageStructure } from "./page-structure-context"

import "@blocknote/core/fonts/inter.css"
import "@blocknote/shadcn/style.css"
import "./editor.css"

const DEFAULT_PLACEHOLDER = "Comece a escrever..."
type EditorInstance = typeof editorSchema.BlockNoteEditor
type SelectedBlock = ReturnType<EditorInstance["getBlock"]>
type BuilderViewport = "desktop" | "tablet" | "mobile"

function findEditorBlockElement(root: HTMLElement | undefined, blockId: string) {
  const matches = Array.from(root?.querySelectorAll<HTMLElement>("[data-id]") ?? [])
    .filter((element) => element.dataset.id === blockId)
  return matches.find((element) => element.dataset.nodeType === "blockContainer") ?? matches[0]
}

export function EditorClient({
  value,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  editable = true,
  autoFocus = false,
  className,
  onFocus,
  onBlur,
  onUpload,
  onError,
  collections,
  mode = "document",
  pageWidth = "wide",
  pageId,
  pageTitle = "Sem título",
}: EditorProps) {
  const { resolvedTheme } = useTheme()
  const onChangeRef = useRef(onChange)
  const onUploadRef = useRef(onUpload)
  const onErrorRef = useRef(onError)
  const lastEmittedDocumentRef = useRef<EditorDocument | undefined>(undefined)
  const appliesExternalDocumentRef = useRef(false)
  const [selectedBlock, setSelectedBlock] = useState<SelectedBlock>()
  const [viewport, setViewport] = useState<BuilderViewport>("desktop")
  const { page: sidebarPage, publishPage, clearPage, selectFromEditor, selectionRequest } = usePageStructure()

  useEffect(() => {
    onChangeRef.current = onChange
    onUploadRef.current = onUpload
    onErrorRef.current = onError
  }, [onChange, onError, onUpload])

  const editor = useCreateBlockNote({
    schema: editorSchema,
    initialContent: normalizeEditorDocument(value),
    dictionary: {
      ...pt,
      placeholders: { ...pt.placeholders, default: placeholder },
    },
    extensions: [syntaxHighlighter],
    uploadFile: onUpload
      ? async (file) => {
          if (!onUploadRef.current) {
            throw new Error("Upload de arquivos não configurado.")
          }

          try {
            return await onUploadRef.current(file)
          } catch (cause) {
            const error = cause instanceof Error
              ? cause
              : new Error("Não foi possível enviar o arquivo.")
            onErrorRef.current?.(error)
            throw error
          }
        }
      : undefined,
  })

  const keepBlockSelected = useCallback((blockId: string) => {
    const block = editor.getBlock(blockId)
    if (!block) return
    setSelectedBlock(block)
    selectFromEditor(block.id)
  }, [editor, selectFromEditor])

  const updateSelectedBlock = useCallback(() => {
    const selectionBlock = editor.getSelection()?.blocks[0]
    if (selectionBlock) {
      setSelectedBlock(editor.getBlock(selectionBlock.id))
      selectFromEditor(selectionBlock.id)
      return
    }

    try {
      const cursorBlock = editor.getTextCursorPosition().block
      setSelectedBlock(editor.getBlock(cursorBlock.id))
      selectFromEditor(cursorBlock.id)
    } catch {
      setSelectedBlock(undefined)
      selectFromEditor(undefined)
    }
  }, [editor, selectFromEditor])

  const selectLayoutFromPointer = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const layout = target.closest<HTMLElement>(".page-layout-section, .page-layout-columns, .page-layout-column, .page-layout-stack, .page-layout-card")
    if (!layout) return

    const layoutBlock = layout.closest<HTMLElement>("[data-node-type=\"blockContainer\"][data-id]")
    const nearestBlock = target.closest<HTMLElement>("[data-node-type=\"blockContainer\"][data-id]")
    if (!layoutBlock?.dataset.id || (nearestBlock && nearestBlock !== layoutBlock)) return

    event.preventDefault()
    keepBlockSelected(layoutBlock.dataset.id)
  }, [keepBlockSelected])

  useEffect(() => {
    if (!autoFocus || !editable) return
    editor.focus()
  }, [autoFocus, editable, editor])

  useEffect(() => {
    if (
      value === lastEmittedDocumentRef.current ||
      areEditorDocumentsEqual(value, editor.document)
    ) return

    appliesExternalDocumentRef.current = true
    editor.replaceBlocks(editor.document, normalizeEditorDocument(value))
    queueMicrotask(() => {
      appliesExternalDocumentRef.current = false
    })
  }, [editor, value])

  useEffect(() => {
    if (!pageId || mode !== "builder") return
    publishPage(pageId, pageTitle, editor.document as EditorDocument)
    return () => clearPage(pageId)
  }, [clearPage, editor, mode, pageId, pageTitle, publishPage])

  useEffect(() => {
    if (!pageId || sidebarPage?.pageId !== pageId || !selectionRequest) return
    const block = editor.getBlock(selectionRequest.blockId)
    if (!block) return

    queueMicrotask(() => {
      setSelectedBlock(block)
      selectFromEditor(block.id)

      const blockElement = findEditorBlockElement(editor.domElement, block.id)
      blockElement?.scrollIntoView({ behavior: "smooth", block: "center" })

      if (block.content !== undefined) {
        editor.setTextCursorPosition(block.id, "start")
        editor.focus()
      }
    })
  }, [editor, pageId, selectFromEditor, selectionRequest, sidebarPage?.pageId])

  useEffect(() => {
    const root = editor.domElement
    root?.querySelectorAll<HTMLElement>("[data-editor-selected]").forEach((element) => {
      delete element.dataset.editorSelected
    })
    if (!selectedBlock) return

    const element = findEditorBlockElement(root, selectedBlock.id)
    if (!element) return
    element.dataset.editorSelected = "true"
    return () => { delete element.dataset.editorSelected }
  }, [editor, selectedBlock])

  return (
    <PageCollectionProvider collections={collections}>
      <div className="editor-workspace" data-mode={mode}>
        <div className="editor-canvas-column">
          {mode === "builder" ? (
            <div className="editor-viewport-toolbar" aria-label="Largura da prévia">
              {(["desktop", "tablet", "mobile"] as const).map((option) => (
                <button key={option} type="button" aria-pressed={viewport === option} onClick={() => setViewport(option)}>
                  {option === "desktop" ? <Monitor /> : option === "tablet" ? <Tablet /> : <Smartphone />}
                  <span className="sr-only">{option}</span>
                </button>
              ))}
            </div>
          ) : null}
          <div className="editor-canvas" data-viewport={viewport} onPointerDownCapture={selectLayoutFromPointer}>
            <div className="page-width-frame" data-page-width={pageWidth}>
              <BlockNoteView
              editor={editor}
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              editable={editable}
              slashMenu={false}
              className={cn("portfolio-editor", className)}
              data-readonly={!editable}
              onFocus={onFocus}
              onBlur={onBlur}
              onSelectionChange={updateSelectedBlock}
              onChange={() => {
                if (!editable || appliesExternalDocumentRef.current) return
                const document = editor.document as EditorDocument
                lastEmittedDocumentRef.current = document
                onChangeRef.current(document)
                if (pageId && mode === "builder") publishPage(pageId, pageTitle, document)
              }}
            >
              {editable ? <EditorSlashMenu editor={editor} /> : null}
              </BlockNoteView>
            </div>
          </div>
        </div>
        {mode === "builder" && editable ? <BlockInspector block={selectedBlock} editor={editor} onKeepSelection={keepBlockSelected} /> : null}
      </div>
    </PageCollectionProvider>
  )
}
