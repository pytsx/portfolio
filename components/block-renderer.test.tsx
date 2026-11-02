import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import type { EditorDocument } from "./editor/editor-types"
import { BlockRenderer } from "./block-renderer"

async function render(content: EditorDocument) {
  return renderToStaticMarkup(await BlockRenderer({ content }))
}

describe("public block renderer", () => {
  it("preserves native BlockNote typography, alignment and colors", async () => {
    const html = await render([{
      type: "heading",
      props: { level: 6, textAlignment: "center", textColor: "purple", backgroundColor: "yellow" },
      content: [{ type: "text", text: "Título", styles: { bold: true, textColor: "red" } }],
    }])

    expect(html).toContain('data-content-type="heading"')
    expect(html).toContain('data-level="6"')
    expect(html).toContain('data-text-alignment="center"')
    expect(html).toContain('data-text-color="purple"')
    expect(html).toContain('data-background-color="yellow"')
    expect(html).toContain("<h6>")
    expect(html).toContain("<strong>")
  })

  it("renders table content and cell properties", async () => {
    const html = await render([{
      type: "table",
      content: {
        type: "tableContent",
        headerRows: 1,
        rows: [
          { cells: [[{ type: "text", text: "Nome", styles: {} }]] },
          { cells: [{ type: "tableCell", props: { textAlignment: "right", backgroundColor: "blue" }, content: [{ type: "text", text: "Projeto", styles: {} }] }] },
        ],
      },
    }])

    expect(html).toContain("<th>")
    expect(html).toContain("Nome")
    expect(html).toContain('data-text-alignment="right"')
    expect(html).toContain('data-background-color="blue"')
    expect(html).toContain("Projeto")
  })

  it("uses the shared layout primitives for composed pages", async () => {
    const html = await render([{
      type: "section",
      props: { contentAlignment: "center", verticalAlignment: "center", minHeight: "screen", surface: "gradient" },
      children: [{
        type: "stack",
        props: { direction: "row", justify: "center", align: "center", gap: "lg", wrap: true },
        children: [{
          type: "card",
          props: { surface: "card", padding: "lg", radius: "lg", border: "subtle", shadow: "md" },
          children: [{ type: "button", props: { href: "/contato", variant: "primary" }, content: "Contato" }],
        }],
      }],
    }])

    expect(html).toContain('class="page-layout-section')
    expect(html).toContain('data-content-alignment="center"')
    expect(html).toContain('data-min-height="screen"')
    expect(html).toContain('class="page-layout-stack"')
    expect(html).toContain('class="page-layout-card"')
    expect(html).toContain('data-shadow="md"')
    expect(html).toContain('href="/contato"')
  })
})
