import { describe, expect, it } from "vitest"

import type { EditorDocument } from "../editor-types"
import {
  areEditorDocumentsEqual,
  getEditorDocumentText,
  normalizeEditorDocument,
  parseEditorDocument,
} from "./document"

const existingDocument: EditorDocument = [
  {
    type: "heading",
    props: { level: 2 },
    content: [{ type: "text", text: "Documento existente", styles: {} }],
  },
]

describe("editor document", () => {
  it("normalizes an empty document without mutating the input", () => {
    const emptyDocument: EditorDocument = []

    expect(normalizeEditorDocument(emptyDocument)).toEqual([
      { type: "paragraph" },
    ])
    expect(emptyDocument).toEqual([])
  })

  it("preserves an existing document and its reference", () => {
    expect(normalizeEditorDocument(existingDocument)).toBe(existingDocument)
  })

  it("accepts structured blocks and rejects invalid values", () => {
    expect(parseEditorDocument(existingDocument)).toEqual(existingDocument)
    expect(parseEditorDocument(null)).toEqual([])
    expect(parseEditorDocument([null, "text", { content: [] }])).toEqual([])
  })

  it("extracts searchable text from nested and formatted content", () => {
    const document: EditorDocument = [
      ...existingDocument,
      {
        type: "bulletListItem",
        content: [{ type: "text", text: "Item", styles: { bold: true } }],
        children: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Filho", styles: {} }],
          },
        ],
      },
    ]

    expect(getEditorDocumentText(document)).toBe(
      "Documento existente\nItem Filho",
    )
  })

  it("extracts semantic content from visual-only blocks", () => {
    const document: EditorDocument = [
      {
        type: "hero",
        props: {
          eyebrow: "Portfólio",
          title: "Produtos digitais",
          description: "Experiências rápidas e acessíveis.",
        },
      },
    ]

    expect(getEditorDocumentText(document)).toContain("Produtos digitais")
    expect(getEditorDocumentText(document)).toContain("Experiências rápidas")
  })

  it("compares cloned documents without serializing on every keystroke", () => {
    const clonedDocument = structuredClone(existingDocument)

    expect(areEditorDocumentsEqual(existingDocument, clonedDocument)).toBe(true)
    expect(
      areEditorDocumentsEqual(existingDocument, [{ type: "paragraph" }]),
    ).toBe(false)
  })
})
