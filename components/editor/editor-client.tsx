"use client"

import { useEffect, useRef } from "react"
import { syntaxHighlighter } from "@blocknote/code-block"
import { pt } from "@blocknote/core/locales"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/shadcn"

import { cn } from "@/lib/utils"
import { EditorSlashMenu } from "./components/slash-menu"
import { PageCollectionProvider } from "./components/page-collection-context"
import { editorSchema } from "./editor-schema"
import type { EditorDocument, EditorProps } from "./editor-types"
import { areEditorDocumentsEqual, normalizeEditorDocument } from "./lib/document"

import "@blocknote/core/fonts/inter.css"
import "@blocknote/shadcn/style.css"
import "./editor.css"

const DEFAULT_PLACEHOLDER = "Comece a escrever..."

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
}: EditorProps) {
  const onChangeRef = useRef(onChange)
  const onUploadRef = useRef(onUpload)
  const onErrorRef = useRef(onError)
  const lastEmittedDocumentRef = useRef<EditorDocument | undefined>(undefined)
  const appliesExternalDocumentRef = useRef(false)

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

  return (
    <PageCollectionProvider collections={collections}>
      <BlockNoteView
        editor={editor}
        editable={editable}
        slashMenu={false}
        className={cn("portfolio-editor", className)}
        data-readonly={!editable}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={() => {
          if (!editable || appliesExternalDocumentRef.current) return
          const document = editor.document as EditorDocument
          lastEmittedDocumentRef.current = document
          onChangeRef.current(document)
        }}
      >
        {editable ? <EditorSlashMenu editor={editor} /> : null}
      </BlockNoteView>
    </PageCollectionProvider>
  )
}
