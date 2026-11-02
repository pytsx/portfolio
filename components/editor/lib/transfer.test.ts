import { describe, expect, it } from "vitest"

import {
  createEditorDocumentExport,
  editorDocumentJsonSchema,
  parseImportedEditorDocument,
} from "./transfer"
import type { EditorDocument } from "../editor-types"

describe("editor transfer", () => {
  it("exports a document as importable JSON", () => {
    const document: EditorDocument = [{ type: "paragraph", content: [] }]

    expect(JSON.parse(createEditorDocumentExport(document))).toEqual(document)
  })

  it("accepts nested supported blocks and rejects invalid content", () => {
    expect(parseImportedEditorDocument([
      { type: "toggleListItem", children: [{ type: "paragraph" }] },
    ])).toHaveLength(1)
    expect(() => parseImportedEditorDocument([{ type: "unsupported" }])).toThrow()
    expect(() => parseImportedEditorDocument({ type: "paragraph" })).toThrow()
  })

  it("documents the page collection block for LLM imports", () => {
    expect(editorDocumentJsonSchema.items.properties.type.enum).toContain("pageCollection")
    expect(editorDocumentJsonSchema.items.properties.type.enum).toContain("card")
    expect(editorDocumentJsonSchema.items.properties.type.enum).not.toContain("featureGrid")
  })

  it("migrates imported legacy web components into editable primitives", () => {
    const [block] = parseImportedEditorDocument([{ type: "callToAction", props: { title: "Contato" } }])
    expect(block.type).toBe("section")
  })
})
