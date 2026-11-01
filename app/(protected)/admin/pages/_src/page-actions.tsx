"use client"

import { useRef, useState } from "react"
import { ClipboardCopy, Download, FileUp, MoreHorizontal } from "lucide-react"

import type { EditorDocument } from "@/components/editor"
import {
  createEditorDocumentExport,
  editorDocumentJsonSchema,
  parseImportedEditorDocument,
} from "@/components/editor/lib/transfer"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PageActionsProps = {
  content: EditorDocument
  fileName: string
  onImport(document: EditorDocument): void
}

function copyText(text: string) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text)

  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.opacity = "0"
  document.body.append(textArea)
  textArea.select()
  document.execCommand("copy")
  textArea.remove()
  return Promise.resolve()
}

function downloadJson({ content, fileName }: Pick<PageActionsProps, "content" | "fileName">) {
  const blob = new Blob([createEditorDocumentExport(content)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${fileName || "pagina"}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function PageActions({ content, fileName, onImport }: PageActionsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string>()

  async function handleCopySchema() {
    try {
      await copyText(JSON.stringify(editorDocumentJsonSchema, null, 2))
      setMessage("Schema copiado.")
    } catch {
      setMessage("Não foi possível copiar o schema.")
    }
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""
    if (!file) return

    try {
      const value = JSON.parse(await file.text()) as unknown
      onImport(parseImportedEditorDocument(value))
      setMessage("Blocos importados. Salve a página para confirmar.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível importar o arquivo.")
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="application/json,.json" className="sr-only" onChange={handleImport} />
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button type="button" variant="outline" size="sm" />}>
          <MoreHorizontal data-icon="inline-start" /> Ações
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Conteúdo da página</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleCopySchema}>
              <ClipboardCopy /> Copiar schema
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => inputRef.current?.click()}>
              <FileUp /> Importar JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadJson({ content, fileName })}>
              <Download /> Exportar JSON
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {message ? <span className="sr-only" role="status">{message}</span> : null}
    </>
  )
}
