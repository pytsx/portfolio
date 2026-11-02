import { SlidersHorizontal } from "lucide-react"

import { editorSchema } from "../editor-schema"
import { propertyLabels } from "../component-registry"
import { duplicateWithoutIds } from "../lib/legacy-layout-migration"

type EditorInstance = typeof editorSchema.BlockNoteEditor
type SelectedBlock = ReturnType<EditorInstance["getBlock"]>

import { inspectorFields as INSPECTOR_FIELDS, type PropertyField } from "../inspector-registry"
function getProperty(block: NonNullable<SelectedBlock>, key: string) {
  return String((block.props as Record<string, unknown>)[key] ?? "")
}

export function BlockInspector({ block, editor }: { block: SelectedBlock; editor: EditorInstance }) {
  const schema: Record<string, { default: unknown; values?: readonly (string | number | boolean)[] }> = block ? editorSchema.blockSchema[block.type].propSchema : {}
  const fields: PropertyField[] | undefined = block ? INSPECTOR_FIELDS[block.type] ?? Object.entries(schema).map(([key, definition]) => ({
    key, label: propertyLabels[key] ?? key,
    options: definition.values?.map((value) => ({ label: String(value), value: String(value) })),
  })) : undefined

  function updateProperty(key: string, value: string) {
    if (!block) return
    const definition = (schema as Record<string, { default: unknown }>)[key]
    const parsed = typeof definition?.default === "number" ? Number(value) : typeof definition?.default === "boolean" ? value === "true" : value
    if (typeof parsed === "number" && !Number.isFinite(parsed)) return
    editor.updateBlock(block.id, { props: { [key]: parsed } })
  }

  return (
    <aside className="editor-inspector" aria-label="Propriedades do bloco">
      <header>
        <SlidersHorizontal className="size-4" />
        <div><strong>Propriedades</strong><span>{block?.type ?? "Nenhum bloco selecionado"}</span></div>
      </header>
      <div className="flex flex-wrap gap-2 text-xs">
        {block ? <>
          <button type="button" onClick={() => editor.moveBlocksUp(block.id)}>↑ Subir</button>
          <button type="button" onClick={() => editor.moveBlocksDown(block.id)}>↓ Descer</button>
          <button type="button" onClick={() => editor.insertBlocks([duplicateWithoutIds(block)], block.id, "after")}>Duplicar</button>
        </> : null}
      </div>
      <details>
        <summary className="text-sm">Camadas</summary>
        <div className="grid gap-1 py-2">
          {(() => {
            function layers(blocks: EditorInstance["document"], depth = 0): React.ReactNode {
              return blocks.map((item) => <div key={item.id}>
                <button type="button" className="w-full rounded px-2 py-1 text-left text-xs aria-pressed:bg-accent" style={{ paddingLeft: 8 + depth * 12 }} aria-pressed={block?.id === item.id} onClick={() => { editor.setSelection(item.id, item.id); editor.focus() }}>{item.type}</button>
                {layers(item.children, depth + 1)}
              </div>)
            }
            return layers(editor.document)
          })()}
        </div>
      </details>
      {block && fields ? (
        <div className="editor-inspector-fields">
          {fields.map((field) => (
            <label key={field.key}>
              <span>{field.label}</span>
              {field.options ? (
                <select value={getProperty(block, field.key)} onChange={(event) => updateProperty(field.key, event.currentTarget.value)}>
                  {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              ) : (
                typeof (block.props as Record<string, unknown>)[field.key] === "boolean" ? (
                  <input type="checkbox" checked={Boolean((block.props as Record<string, unknown>)[field.key])} onChange={(event) => updateProperty(field.key, String(event.currentTarget.checked))} />
                ) : <input type={typeof (block.props as Record<string, unknown>)[field.key] === "number" ? "number" : "text"} value={String((block.props as Record<string, unknown>)[field.key] ?? "")} onChange={(event) => updateProperty(field.key, event.currentTarget.value)} />
              )}
            </label>
          ))}
        </div>
      ) : (
        <p>Selecione uma seção visual para editar largura, aparência e conteúdo.</p>
      )}
    </aside>
  )
}
