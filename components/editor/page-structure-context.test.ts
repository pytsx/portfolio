import { describe, expect, it } from "vitest"

import type { EditorDocument } from "./editor-types"
import { createPageLayers } from "./page-structure-context"

describe("page structure", () => {
  it("creates a selectable tree without copying block content", () => {
    const document = [{
      id: "section-1",
      type: "section",
      children: [{
        id: "stack-1",
        type: "stack",
        children: [{ id: "heading-1", type: "heading", content: "Título privado da página" }],
      }],
    }] as EditorDocument

    expect(createPageLayers(document)).toEqual([{
      id: "section-1",
      type: "section",
      label: "Seção",
      children: [{
        id: "stack-1",
        type: "stack",
        label: "Pilha",
        children: [{ id: "heading-1", type: "heading", label: "Título", children: [] }],
      }],
    }])
  })

  it("ignores incomplete partial blocks that cannot be selected", () => {
    expect(createPageLayers([{ type: "paragraph" }] as EditorDocument)).toEqual([])
  })
})
