import { createReactBlockSpec } from "@blocknote/react"
import { Eye, LayoutList, Star } from "lucide-react"

import { usePageCollections } from "../components/page-collection-context"
import { commonBlockProps } from "../component-registry"
import { pageBelongsToCollection } from "../../../lib/pages/collection-membership"

const DISPLAY_MODES = ["database", "preview"] as const
const VISIBILITY_FILTERS = ["all", "public", "private"] as const

type CollectionProperties = {
  groupId: string
  query: string
  limit: number
  layout: "grid" | "list"
  displayMode: "database" | "preview"
  visibility: "all" | "public" | "private"
  homeOnly: boolean
}

type CollectionBlock = { props: CollectionProperties }

type CollectionEditor = {
  isEditable: boolean
  updateBlock(
    block: CollectionBlock,
    update: { props: Record<string, string | number | boolean> },
  ): void
}

function PageCollectionBlockView({
  block,
  editor,
}: {
  block: CollectionBlock
  editor: CollectionEditor
}) {
  const { pages, groups } = usePageCollections()
  const groupId = block.props.groupId
  const selectedGroup = groups.find((group) => group.id === groupId)
  const query = block.props.query.trim().toLocaleLowerCase("pt-BR")
  const filteredPages = pages
    .filter((page) => pageBelongsToCollection(page, groupId, groups))
    .filter((page) => block.props.visibility === "all" || page.visibility === block.props.visibility)
    .filter((page) => !block.props.homeOnly || page.isHome)
    .filter((page) => !query || page.title.toLocaleLowerCase("pt-BR").includes(query))
    .slice(0, Math.max(1, Math.min(block.props.limit, 50)))

  function updateProperties(properties: Record<string, string | number | boolean>) {
    if (!editor.isEditable) return
    editor.updateBlock(block, { props: properties })
  }

  return (
    <section className="editor-page-collection" contentEditable={false}>
      <header className="editor-page-collection-header">
        <div>
          <strong>Coleção de páginas</strong>
          <span>{selectedGroup?.path ?? "Todas as páginas"}</span>
        </div>
        <div className="editor-page-collection-tabs" role="tablist" aria-label="Visualização da coleção">
          <button type="button" role="tab" aria-selected={block.props.displayMode === "database"} onClick={() => updateProperties({ displayMode: "database" })}>
            <LayoutList /> Banco de dados
          </button>
          <button type="button" role="tab" aria-selected={block.props.displayMode === "preview"} onClick={() => updateProperties({ displayMode: "preview" })}>
            <Eye /> Prévia pública
          </button>
        </div>
      </header>
      <div className="editor-page-collection-controls">
        <select aria-label="Grupo da coleção" value={groupId} disabled={!editor.isEditable} onChange={(event) => updateProperties({ groupId: event.currentTarget.value })}>
          <option value="">Todos os grupos</option>
          {groups.map((group) => <option key={group.id} value={group.id}>{group.path}</option>)}
        </select>
        <input aria-label="Filtrar por título" placeholder="Filtrar documentos" defaultValue={block.props.query} readOnly={!editor.isEditable} onBlur={(event) => updateProperties({ query: event.currentTarget.value.trim() })} />
        <input type="number" min={1} max={50} aria-label="Limite de documentos" defaultValue={block.props.limit} readOnly={!editor.isEditable} onBlur={(event) => updateProperties({ limit: Number(event.currentTarget.value) || 6 })} />
      </div>
      <div className="editor-page-collection-filters" aria-label="Filtros da coleção">
        {VISIBILITY_FILTERS.map((visibility) => (
          <button key={visibility} type="button" aria-pressed={block.props.visibility === visibility} onClick={() => updateProperties({ visibility })}>
            {visibility === "all" ? "Todas" : visibility === "public" ? "Públicas" : "Privadas"}
          </button>
        ))}
        <button type="button" aria-pressed={block.props.homeOnly} onClick={() => updateProperties({ homeOnly: !block.props.homeOnly })}>
          <Star /> Principal
        </button>
      </div>
      {block.props.displayMode === "database" ? (
        <div className="editor-page-collection-table" role="table" aria-label="Documentos da coleção">
          <div role="row" className="editor-page-collection-table-header"><span role="columnheader">Documento</span><span role="columnheader">Visibilidade</span><span role="columnheader">Principal</span></div>
          {filteredPages.map((page) => <a key={page.id} href={page.href} role="row" className="editor-page-collection-table-row"><span role="cell">{page.title}</span><span role="cell">{page.visibility === "public" ? "Pública" : "Privada"}</span><span role="cell">{page.isHome ? "Sim" : "—"}</span></a>)}
        </div>
      ) : (
        <div className={block.props.layout === "list" ? "editor-page-collection-preview-list" : "editor-page-collection-preview-grid"}>
          {filteredPages.map((page) => <a key={page.id} href={page.href} className="editor-page-collection-preview-card"><span>{page.title}</span>{page.isHome ? <Star aria-label="Página principal" /> : null}</a>)}
        </div>
      )}
      {filteredPages.length === 0 ? <p className="editor-page-collection-empty">Nenhum documento corresponde aos filtros.</p> : null}
    </section>
  )
}

export const pageCollectionBlock = createReactBlockSpec(
  {
    type: "pageCollection",
    propSchema: {
      ...commonBlockProps,
      groupId: { default: "" },
      query: { default: "" },
      limit: { default: 6, type: "number" },
      layout: { default: "grid", values: ["grid", "list"] as const },
      displayMode: { default: "database", values: DISPLAY_MODES },
      visibility: { default: "all", values: VISIBILITY_FILTERS },
      homeOnly: { default: false, type: "boolean" },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <PageCollectionBlockView
        block={block as CollectionBlock}
        editor={editor as unknown as CollectionEditor}
      />
    ),
  },
)()
