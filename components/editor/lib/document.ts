import type { EditorDocument } from "../editor-types"
import deepEqual from "fast-deep-equal"

export const EMPTY_EDITOR_DOCUMENT: EditorDocument = []

export function normalizeEditorDocument(
  document: EditorDocument,
): EditorDocument {
  return document.length > 0 ? document : [{ type: "paragraph" }]
}

export function parseEditorDocument(value: unknown): EditorDocument {
  if (!Array.isArray(value)) return []

  return value.filter(
    (block): block is EditorDocument[number] =>
      typeof block === "object" && block !== null && "type" in block,
  )
}

function inlineContentText(value: unknown): string {
  if (!Array.isArray(value)) return typeof value === "string" ? value : ""

  return value
    .map((content) => {
      if (typeof content === "string") return content
      if (!content || typeof content !== "object") return ""

      if ("text" in content && typeof content.text === "string") {
        return content.text
      }

      if ("content" in content) return inlineContentText(content.content)
      return ""
    })
    .join("")
}

const SEMANTIC_PROPERTY_KEYS = new Set([
  "eyebrow", "title", "description", "label", "caption", "name",
  "firstTitle", "firstDescription", "secondTitle", "secondDescription",
  "thirdTitle", "thirdDescription",
])

function blockPropertiesText(block: EditorDocument[number]) {
  if (!("props" in block) || !block.props) return ""

  return Object.entries(block.props)
    .filter(([key, value]) => SEMANTIC_PROPERTY_KEYS.has(key) && typeof value === "string")
    .map(([, value]) => value)
    .join(" ")
}

export function getEditorDocumentText(document: EditorDocument): string {
  return document
    .map((block) => {
      const content = "content" in block ? inlineContentText(block.content) : ""
      const properties = blockPropertiesText(block)
      const children = "children" in block && Array.isArray(block.children)
        ? getEditorDocumentText(block.children)
        : ""
      return [content, properties, children].filter(Boolean).join(" ")
    })
    .filter(Boolean)
    .join("\n")
}

export function areEditorDocumentsEqual(
  first: EditorDocument,
  second: EditorDocument,
) {
  if (first === second) return true
  return deepEqual(first, second)
}
