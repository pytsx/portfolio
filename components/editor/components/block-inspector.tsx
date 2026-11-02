import { ChevronDown, Copy, MoveDown, MoveUp, RotateCcw, SlidersHorizontal } from "lucide-react"

import { editorSchema } from "../editor-schema"
import { duplicateWithoutIds } from "../lib/legacy-layout-migration"
import { getBlockFamily, getInspectorSections, type PropertyField } from "../inspector-registry"

type EditorInstance = typeof editorSchema.BlockNoteEditor
type SelectedBlock = ReturnType<EditorInstance["getBlock"]>
type PropertySchema = Record<string, { default: unknown; type?: "string" | "number" | "boolean"; values?: readonly (string | number | boolean)[] }>

function propertyValue(block: NonNullable<SelectedBlock>, key: string) {
  return (block.props as Record<string, unknown>)[key]
}

export function BlockInspector({ block, editor, onKeepSelection }: { block: SelectedBlock; editor: EditorInstance; onKeepSelection: (blockId: string) => void }) {
  const schema: PropertySchema = block ? editorSchema.blockSchema[block.type].propSchema : {}
  const sections = block ? getInspectorSections(schema) : []

  function updateProperty(field: PropertyField, value: unknown) {
    if (!block) return
    const parsed = value === undefined ? undefined : field.kind === "number" ? Number(value) : field.kind === "boolean" ? Boolean(value) : value
    if (field.kind === "number" && parsed !== undefined && !Number.isFinite(parsed)) return
    editor.updateBlock(block.id, { props: { [field.key]: parsed } })
    queueMicrotask(() => onKeepSelection(block.id))
  }

  return (
    <aside className="editor-inspector" aria-label="Propriedades do bloco">
      <header>
        <SlidersHorizontal className="size-4" />
        <div>
          <strong>Propriedades</strong>
          <span>{block ? `${getBlockFamily(block.type)} · ${block.type}` : "Nenhum bloco selecionado"}</span>
        </div>
      </header>

      {block ? (
        <div className="editor-inspector-actions" aria-label="Ações do bloco">
          <button type="button" title="Subir" aria-label="Subir" onClick={() => editor.moveBlocksUp(block.id)}><MoveUp /></button>
          <button type="button" title="Descer" aria-label="Descer" onClick={() => editor.moveBlocksDown(block.id)}><MoveDown /></button>
          <button type="button" title="Duplicar" aria-label="Duplicar" onClick={() => editor.insertBlocks([duplicateWithoutIds(block)], block.id, "after")}><Copy /></button>
        </div>
      ) : null}

      {block && sections.length > 0 ? (
        <div className="editor-inspector-sections">
          {sections.map((section) => (
            <details key={section.id} className="editor-inspector-section" open>
              <summary><ChevronDown /><span>{section.label}</span></summary>
              <div className="editor-inspector-fields">
                {section.fields.map((field) => {
                  const value = propertyValue(block, field.key)
                  const changed = value !== field.defaultValue
                  return (
                    <div className="editor-property-row" key={field.key}>
                      <div className="editor-property-label">
                        <label htmlFor={`${block.id}-${field.key}`}>{field.label}</label>
                        {changed ? <button type="button" title="Restaurar padrão" aria-label={`Restaurar ${field.label}`} onClick={() => updateProperty(field, field.defaultValue)}><RotateCcw /></button> : null}
                      </div>
                      {field.kind === "select" ? (
                        <select id={`${block.id}-${field.key}`} value={String(value ?? "")} onChange={(event) => updateProperty(field, event.currentTarget.value)}>
                          {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      ) : field.kind === "boolean" ? (
                        <button id={`${block.id}-${field.key}`} type="button" role="switch" aria-checked={Boolean(value)} className="editor-property-switch" onClick={() => updateProperty(field, !Boolean(value))}><span /></button>
                      ) : (
                        <input id={`${block.id}-${field.key}`} type={field.kind} value={String(value ?? "")} onChange={(event) => updateProperty(field, event.currentTarget.value)} />
                      )}
                      {field.description ? <p>{field.description}</p> : null}
                    </div>
                  )
                })}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <p>{block ? "Este bloco não possui propriedades configuráveis." : "Selecione um elemento no canvas ou na árvore da página."}</p>
      )}
    </aside>
  )
}
