import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"

import {
  PageCard,
  PageColumn,
  PageColumns,
  PageSection,
  PageStack,
  type PageColumnsProperties,
  type PageCardProperties,
  type PageColumnProperties,
  type PageSectionProperties,
  type PageStackProperties,
  type StructureBoxProperties,
} from "./editor/components/page-layouts"
import type { EditorDocument } from "./editor/editor-types"
import "./editor/editor.css"

export type BlockCollectionItem = {
  id: string
  title: string
  href: string
  visibility: "public" | "private"
  isHome: boolean
}

type BlockRendererProps = {
  content: EditorDocument
  collections?: Record<string, BlockCollectionItem[]>
}

type RenderableBlock = {
  type: string
  props?: Record<string, unknown>
  content?: unknown
  children?: EditorDocument
}

type InlineContent = {
  type?: string
  text?: string
  href?: string
  content?: InlineContent[]
  styles?: Record<string, unknown>
}

type TableCell = {
  type?: string
  props?: Record<string, unknown>
  content?: unknown
}

type TableContent = {
  rows?: Array<{ cells?: Array<TableCell | unknown> }>
  columnWidths?: Array<number | undefined>
  headerRows?: number
  headerCols?: number
}

const BLOCKNOTE_COLORS = new Set(["gray", "brown", "red", "orange", "yellow", "green", "blue", "purple", "pink"])

function blockNoteColor(value: unknown) {
  return typeof value === "string" && BLOCKNOTE_COLORS.has(value) ? value : undefined
}

function asRenderableBlock(block: EditorDocument[number]): RenderableBlock {
  return block as RenderableBlock
}

function asInlineContent(value: unknown): InlineContent[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is InlineContent => (
    typeof item === "object" && item !== null
  ))
}

function getSafeHref(value: string) {
  const href = value.trim()
  if (href.startsWith("/") && !href.startsWith("//") && !href.includes("\\")) {
    return href
  }

  try {
    const url = new URL(href)
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined
  } catch {
    return undefined
  }
}

function InlineText({ content }: { content: unknown }) {
  if (typeof content === "string") return <>{content}</>

  return (
    <>
      {asInlineContent(content).map((item, index) => {
        const styles = item.styles ?? {}
        let value: ReactNode = <InlineText content={item.content ?? item.text} />

        if (styles.bold) value = <strong>{value}</strong>
        if (styles.italic) value = <em>{value}</em>
        if (styles.underline) value = <u>{value}</u>
        if (styles.strike) value = <s>{value}</s>
        if (styles.code) value = <code>{value}</code>

        const textColor = blockNoteColor(styles.textColor)
        const backgroundColor = blockNoteColor(styles.backgroundColor)
        if (textColor || backgroundColor) {
          value = <span data-text-color={textColor} data-background-color={backgroundColor}>{value}</span>
        }

        const href = item.href ? getSafeHref(item.href) : undefined
        if (item.type === "link" && href) {
          value = href.startsWith("/") ? <Link href={href} prefetch>{value}</Link> : <a href={href}>{value}</a>
        }

        return <span key={index}>{value}</span>
      })}
    </>
  )
}

function plainText(content: unknown) {
  if (typeof content === "string") return content
  if (!Array.isArray(content)) return ""
  return content.map((item) => typeof item === "string" ? item : item && typeof item === "object" && "text" in item && typeof item.text === "string" ? item.text : "").join("")
}

function TableBlock({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") return null
  const table = content as TableContent
  if (!Array.isArray(table.rows)) return null

  return (
    <div className="portfolio-table-wrapper">
      <table>
        {Array.isArray(table.columnWidths) ? <colgroup>{table.columnWidths.map((width, index) => <col key={index} style={typeof width === "number" ? { width } : undefined} />)}</colgroup> : null}
        <tbody>
          {table.rows.map((row, rowIndex) => <tr key={rowIndex}>
            {(row.cells ?? []).map((sourceCell, columnIndex) => {
              const cell = sourceCell && typeof sourceCell === "object" && "content" in sourceCell ? sourceCell as TableCell : { content: sourceCell }
              const Cell = rowIndex < (table.headerRows ?? 0) || columnIndex < (table.headerCols ?? 0) ? "th" : "td"
              const cellProps = cell.props ?? {}
              return <Cell
                key={columnIndex}
                colSpan={typeof cellProps.colspan === "number" ? cellProps.colspan : undefined}
                rowSpan={typeof cellProps.rowspan === "number" ? cellProps.rowspan : undefined}
                data-text-alignment={typeof cellProps.textAlignment === "string" ? cellProps.textAlignment : undefined}
                data-text-color={blockNoteColor(cellProps.textColor)}
                data-background-color={blockNoteColor(cellProps.backgroundColor)}
              ><InlineText content={cell.content} /></Cell>
            })}
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}

function getBlockKey(block: EditorDocument[number], path: string) {
  return block.id ?? path
}

function BlockChildren({ children, collections, path }: { children?: EditorDocument; collections: Record<string, BlockCollectionItem[]>; path: string }) {
  if (!children?.length) return null
  return <div className="portfolio-block-children">{children.map((child, index) => <Block key={getBlockKey(child, `${path}.${index}`)} block={child} collections={collections} path={`${path}.${index}`} />)}</div>
}

function YouTubeBlock({ props }: { props: Record<string, unknown> }) {
  const url = typeof props.url === "string" ? props.url : ""
  let videoId: string | undefined

  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname === "youtu.be") videoId = parsedUrl.pathname.slice(1)
    if (parsedUrl.hostname.endsWith("youtube.com")) {
      if (parsedUrl.pathname === "/watch") videoId = parsedUrl.searchParams.get("v") ?? undefined
      if (parsedUrl.pathname.startsWith("/embed/")) videoId = parsedUrl.pathname.split("/")[2]
      if (parsedUrl.pathname.startsWith("/shorts/")) videoId = parsedUrl.pathname.split("/")[2]
    }
  } catch {
    videoId = undefined
  }

  if (!videoId) return null
  const caption = typeof props.caption === "string" ? props.caption : ""

  return (
    <figure className="editor-youtube">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={caption || "Vídeo do YouTube"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function asStructureBoxProperties(props: Record<string, unknown>, defaults: Partial<StructureBoxProperties> = {}): StructureBoxProperties {
  return {
    surface: props.surface === "card" || props.surface === "muted" || props.surface === "contrast" || props.surface === "gradient" ? props.surface : defaults.surface ?? "transparent",
    padding: props.padding === "sm" || props.padding === "md" || props.padding === "lg" || props.padding === "xl" ? props.padding : defaults.padding ?? "none",
    radius: props.radius === "sm" || props.radius === "md" || props.radius === "lg" ? props.radius : defaults.radius ?? "none",
    border: props.border === "subtle" || props.border === "strong" ? props.border : defaults.border ?? "none",
    shadow: props.shadow === "sm" || props.shadow === "md" ? props.shadow : defaults.shadow ?? "none",
    minHeight: props.minHeight === "sm" || props.minHeight === "md" || props.minHeight === "lg" || props.minHeight === "screen" ? props.minHeight : defaults.minHeight ?? "auto",
    contentAlignment: props.contentAlignment === "center" || props.contentAlignment === "right" ? props.contentAlignment : defaults.contentAlignment ?? "left",
    verticalAlignment: props.verticalAlignment === "center" || props.verticalAlignment === "end" ? props.verticalAlignment : defaults.verticalAlignment ?? "start",
  }
}

function asSectionProperties(props: Record<string, unknown>): PageSectionProperties {
  return {
    ...asStructureBoxProperties(props, { padding: "lg" }),
    width: props.width === "narrow" || props.width === "standard" || props.width === "full" ? props.width : "wide",
    anchor: typeof props.anchor === "string" ? props.anchor : "",
    effect: props.effect === "fade" || props.effect === "slide" ? props.effect : "none",
  }
}

function asColumnsProperties(props: Record<string, unknown>): PageColumnsProperties {
  return {
    ...asStructureBoxProperties(props),
    distribution: props.distribution === "sidebar-left" || props.distribution === "sidebar-right" ? props.distribution : "equal",
    gap: props.gap === "none" || props.gap === "sm" || props.gap === "lg" || props.gap === "xl" ? props.gap : "md",
    mobile: props.mobile === "scroll" ? "scroll" : "stack",
    align: props.align === "start" || props.align === "center" || props.align === "end" ? props.align : "stretch",
  }
}

function asStackProperties(props: Record<string, unknown>): PageStackProperties {
  return {
    ...asStructureBoxProperties(props),
    direction: props.direction === "row" ? "row" : "column",
    gap: props.gap === "none" || props.gap === "sm" || props.gap === "lg" || props.gap === "xl" ? props.gap : "md",
    justify: props.justify === "center" || props.justify === "end" || props.justify === "between" ? props.justify : "start",
    align: props.align === "start" || props.align === "center" || props.align === "end" ? props.align : "stretch",
    wrap: props.wrap !== false,
  }
}

function asCardProperties(props: Record<string, unknown>): PageCardProperties {
  return asStructureBoxProperties(props, { surface: "card", padding: "md", radius: "md", border: "subtle", shadow: "sm" })
}

function asColumnProperties(props: Record<string, unknown>): PageColumnProperties { return asStructureBoxProperties(props) }

type BlockProps = { block: EditorDocument[number]; collections: Record<string, BlockCollectionItem[]>; path: string }

function Block(props: BlockProps) {
  const properties = asRenderableBlock(props.block).props ?? {}
  const alignment = properties.textAlignment
  const rendersOwnChildren = ["bulletListItem", "numberedListItem", "quote", "toggleListItem", "section", "columns", "column", "stack", "card"].includes(props.block.type ?? "")
  return <div
    className="portfolio-block-content"
    data-content-type={props.block.type}
    data-level={props.block.type === "heading" && typeof properties.level === "number" ? properties.level : undefined}
    data-text-alignment={alignment === "left" || alignment === "center" || alignment === "right" || alignment === "justify" ? alignment : undefined}
    data-text-color={blockNoteColor(properties.textColor)}
    data-background-color={blockNoteColor(properties.backgroundColor)}
  >
    <BlockContent {...props} />
    {rendersOwnChildren ? null : <BlockChildren collections={props.collections} path={props.path}>{asRenderableBlock(props.block).children}</BlockChildren>}
  </div>
}

function BlockContent({ block: sourceBlock, collections, path }: BlockProps) {
  const block = asRenderableBlock(sourceBlock)
  const props = block.props ?? {}
  const content = <InlineText content={block.content} />
  const blockKey = getBlockKey(sourceBlock, path)

  switch (block.type) {
    case "button":
      return typeof props.href === "string" && getSafeHref(props.href)?.startsWith("/")
        ? <Link className="builder-button" data-variant={props.variant ?? "primary"} href={getSafeHref(props.href)!} prefetch>{content}</Link>
        : <a className="builder-button" data-variant={props.variant ?? "primary"} href={typeof props.href === "string" ? getSafeHref(props.href) : undefined}>{content}</a>
    case "paragraph":
      return <p>{content}</p>
    case "heading": {
      const level = typeof props.level === "number" && props.level >= 1 && props.level <= 6 ? props.level : 3
      const Heading = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
      return <Heading><span>{content}</span></Heading>
    }
    case "bulletListItem":
      return <ul><li><span>{content}</span><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></li></ul>
    case "numberedListItem":
      return <ol><li><span>{content}</span><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></li></ol>
    case "checkListItem":
      return <div className="portfolio-check-list-item"><input type="checkbox" checked={props.checked === true} readOnly /><span>{content}</span></div>
    case "quote":
      return <blockquote>{content}<BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></blockquote>
    case "codeBlock":
      return <pre data-language={typeof props.language === "string" ? props.language : undefined}><code>{plainText(block.content)}</code></pre>
    case "divider":
      return <hr />
    case "image":
      return typeof props.url === "string" && getSafeHref(props.url)
        ? <figure className="portfolio-media"><Image src={getSafeHref(props.url)!} alt={typeof props.caption === "string" ? props.caption : ""} width={1200} height={675} sizes="(max-width: 768px) 100vw, 896px" style={typeof props.previewWidth === "number" ? { maxWidth: props.previewWidth } : undefined} />{props.caption ? <figcaption>{String(props.caption)}</figcaption> : null}</figure>
        : null
    case "video":
      return typeof props.url === "string" && getSafeHref(props.url) ? <figure className="portfolio-media"><video controls src={getSafeHref(props.url)} style={typeof props.previewWidth === "number" ? { maxWidth: props.previewWidth } : undefined} />{props.caption ? <figcaption>{String(props.caption)}</figcaption> : null}</figure> : null
    case "audio":
      return typeof props.url === "string" && getSafeHref(props.url) ? <figure className="portfolio-media"><audio controls src={getSafeHref(props.url)} />{props.caption ? <figcaption>{String(props.caption)}</figcaption> : null}</figure> : null
    case "file":
      return typeof props.url === "string" && getSafeHref(props.url) ? <a className="portfolio-file" href={getSafeHref(props.url)}>{typeof props.name === "string" && props.name ? props.name : props.url}{props.caption ? <small>{String(props.caption)}</small> : null}</a> : null
    case "callout":
      return <aside className="editor-callout" data-tone={typeof props.tone === "string" ? props.tone : "info"} role="note"><span className="editor-callout-icon">{typeof props.icon === "string" ? props.icon : "💡"}</span><div><InlineText content={block.content} /></div></aside>
    case "youtube":
      return <YouTubeBlock props={props} />
    case "toggleListItem":
      return <details><summary>{content}</summary><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></details>
    case "table":
      return <TableBlock content={block.content} />
    case "section":
      return <PageSection properties={asSectionProperties(props)}><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></PageSection>
    case "columns":
      return <PageColumns properties={asColumnsProperties(props)}><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></PageColumns>
    case "column":
      return <PageColumn properties={asColumnProperties(props)}><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></PageColumn>
    case "stack":
      return <PageStack properties={asStackProperties(props)}><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></PageStack>
    case "card":
      return <PageCard properties={asCardProperties(props)}><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></PageCard>
    case "pageCollection":
      return <PageCollection items={collections[blockKey] ?? []} layout={props.layout === "list" ? "list" : "grid"} />
    default:
      return <div>{content}</div>
  }
}

function PageCollection({
  items,
  layout,
}: {
  items: BlockCollectionItem[]
  layout: "grid" | "list"
}) {
  if (items.length === 0) {
    return <p className="py-8 text-sm text-muted-foreground">Nenhum item encontrado.</p>
  }

  return (
    <div className={layout === "grid" ? "grid gap-4 sm:grid-cols-2" : "grid gap-2"}>
      {items.map((item) => (
        <Link key={item.id} href={item.href} prefetch className="rounded-2xl border p-5 text-lg font-medium transition-colors hover:bg-muted">
          {item.title}
        </Link>
      ))}
    </div>
  )
}

export async function BlockRenderer({
  content,
  collections = {},
}: BlockRendererProps) {
  return (
    <div className="portfolio-block-renderer">
      {content.map((sourceBlock, index) => {
        const path = String(index)
        return <div key={getBlockKey(sourceBlock, path)} className="portfolio-block" data-block-type={sourceBlock.type}><Block block={sourceBlock} collections={collections} path={path} /></div>
      })}
    </div>
  )
}
