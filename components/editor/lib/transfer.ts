import type { EditorDocument } from "../editor-types"

const IMPORTABLE_BLOCK_TYPES = [
  "paragraph",
  "heading",
  "bulletListItem",
  "numberedListItem",
  "checkListItem",
  "quote",
  "divider",
  "toggleListItem",
  "codeBlock",
  "table",
  "image",
  "video",
  "audio",
  "file",
  "callout",
  "youtube",
  "pageCollection",
  "hero",
  "featureGrid",
  "callToAction",
] as const

export const editorDocumentJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Portfolio page blocks",
  description: "JSON importável pelo editor de páginas. O documento inteiro deve ser um array de blocos.",
  type: "array",
  items: {
    type: "object",
    required: ["type"],
    properties: {
      id: { type: "string", description: "Opcional. O editor pode gerar o identificador." },
      type: { enum: IMPORTABLE_BLOCK_TYPES },
      props: {
        type: "object",
        description: "Propriedades do bloco. heading usa level (1 a 3); callout usa icon e tone; youtube usa url e caption; pageCollection usa groupId, query, limit, layout, displayMode, visibility e homeOnly; hero, featureGrid e callToAction compõem seções web.",
      },
      content: {
        description: "Texto rico em array, por exemplo [{ type: 'text', text: 'Olá', styles: { bold: true } }]. Blocos youtube, divider e pageCollection não usam conteúdo.",
      },
      children: { $ref: "#" },
    },
    additionalProperties: true,
  },
  examples: [
    [
      {
        type: "heading",
        props: { level: 1 },
        content: [{ type: "text", text: "Título", styles: {} }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Conteúdo da página.", styles: {} }],
      },
      {
        type: "callout",
        props: { icon: "💡", tone: "info" },
        content: [{ type: "text", text: "Uma observação útil.", styles: {} }],
      },
    ],
  ],
} as const

function isImportableBlock(value: unknown): value is EditorDocument[number] {
  if (typeof value !== "object" || value === null || !("type" in value)) return false

  const block = value as { children?: unknown; type?: unknown }
  if (typeof block.type !== "string" || !IMPORTABLE_BLOCK_TYPES.includes(block.type as typeof IMPORTABLE_BLOCK_TYPES[number])) {
    return false
  }

  return block.children === undefined || isImportedDocument(block.children)
}

function isImportedDocument(value: unknown): value is EditorDocument {
  return Array.isArray(value) && value.every(isImportableBlock)
}

export function parseImportedEditorDocument(value: unknown): EditorDocument {
  if (!isImportedDocument(value)) {
    throw new Error("O arquivo não contém uma lista válida de blocos do editor.")
  }

  return value
}

export function createEditorDocumentExport(document: EditorDocument) {
  return JSON.stringify(document, null, 2)
}
