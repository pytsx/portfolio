import Link from "next/link"
import Image from "next/image"
import type { CSSProperties } from "react"

import {
  CallToActionSection,
  FeatureGridSection,
  type CallToActionSectionProps,
  type FeatureGridSectionProps,
} from "@/components/editor/components/web-page-sections"
import {
  PageColumn,
  PageColumns,
  PageSection,
  PageStack,
  type PageColumnsProperties,
  type PageSectionProperties,
  type PageStackProperties,
} from "@/components/editor/components/page-layouts"
import type { EditorDocument } from "@/components/editor/editor-types"
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
        let value: React.ReactNode = <InlineText content={item.content ?? item.text} />

        if (styles.bold) value = <strong>{value}</strong>
        if (styles.italic) value = <em>{value}</em>
        if (styles.underline) value = <u>{value}</u>
        if (styles.strike) value = <s>{value}</s>
        if (styles.code) value = <code>{value}</code>

        const href = item.href ? getSafeHref(item.href) : undefined
        if (item.type === "link" && href) {
          value = <a href={href}>{value}</a>
        }

        return <span key={index}>{value}</span>
      })}
    </>
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

function asFeatureGridProps(props: Record<string, unknown>): FeatureGridSectionProps {
  return {
    title: typeof props.title === "string" ? props.title : "",
    description: typeof props.description === "string" ? props.description : "",
    firstTitle: typeof props.firstTitle === "string" ? props.firstTitle : "",
    firstDescription: typeof props.firstDescription === "string" ? props.firstDescription : "",
    secondTitle: typeof props.secondTitle === "string" ? props.secondTitle : "",
    secondDescription: typeof props.secondDescription === "string" ? props.secondDescription : "",
    thirdTitle: typeof props.thirdTitle === "string" ? props.thirdTitle : "",
    thirdDescription: typeof props.thirdDescription === "string" ? props.thirdDescription : "",
  }
}

function asCallToActionProps(props: Record<string, unknown>): CallToActionSectionProps {
  return {
    title: typeof props.title === "string" ? props.title : "",
    description: typeof props.description === "string" ? props.description : "",
    label: typeof props.label === "string" ? props.label : "",
    href: typeof props.href === "string" ? getSafeHref(props.href) ?? "#" : "#",
    appearance: props.appearance === "gradient" ? "gradient" : props.appearance === "inverted" ? "inverted" : "default",
  }
}

function asSectionProperties(props: Record<string, unknown>): PageSectionProperties {
  return {
    width: props.width === "narrow" || props.width === "standard" || props.width === "full" ? props.width : "wide",
    surface: props.surface === "muted" || props.surface === "contrast" || props.surface === "gradient" ? props.surface : "transparent",
    spacing: props.spacing === "sm" || props.spacing === "md" || props.spacing === "xl" ? props.spacing : "lg",
    radius: props.radius === "md" || props.radius === "lg" ? props.radius : "none",
    anchor: typeof props.anchor === "string" ? props.anchor : "",
    effect: props.effect === "fade" || props.effect === "slide" ? props.effect : "none",
    contentAlignment: props.contentAlignment === "center" || props.contentAlignment === "right" ? props.contentAlignment : "left",
    verticalAlignment: props.verticalAlignment === "center" || props.verticalAlignment === "end" ? props.verticalAlignment : "start",
    minHeight: props.minHeight === "large" || props.minHeight === "screen" ? props.minHeight : "auto",
  }
}

function asColumnsProperties(props: Record<string, unknown>): PageColumnsProperties {
  return {
    distribution: props.distribution === "sidebar-left" || props.distribution === "sidebar-right" ? props.distribution : "equal",
    gap: props.gap === "sm" || props.gap === "lg" ? props.gap : "md",
    mobile: props.mobile === "scroll" ? "scroll" : "stack",
    align: props.align === "start" || props.align === "center" || props.align === "end" ? props.align : "stretch",
  }
}

function asStackProperties(props: Record<string, unknown>): PageStackProperties {
  return {
    direction: props.direction === "row" ? "row" : "column",
    gap: props.gap === "none" || props.gap === "sm" || props.gap === "lg" || props.gap === "xl" ? props.gap : "md",
    justify: props.justify === "center" || props.justify === "end" || props.justify === "between" ? props.justify : "start",
    align: props.align === "start" || props.align === "center" || props.align === "end" ? props.align : "stretch",
    wrap: props.wrap !== false,
  }
}

type BlockProps = { block: EditorDocument[number]; collections: Record<string, BlockCollectionItem[]>; path: string }

function Block(props: BlockProps) {
  const properties = asRenderableBlock(props.block).props ?? {}
  const alignment = properties.textAlignment
  const style: CSSProperties = {
    textAlign: alignment === "left" || alignment === "center" || alignment === "right" || alignment === "justify" ? alignment : undefined,
    color: typeof properties.textColor === "string" && properties.textColor !== "default" ? properties.textColor : undefined,
    backgroundColor: typeof properties.backgroundColor === "string" && properties.backgroundColor !== "default" ? properties.backgroundColor : undefined,
  }
  return <div style={style}><BlockContent {...props} /></div>
}

function BlockContent({ block: sourceBlock, collections, path }: BlockProps) {
  const block = asRenderableBlock(sourceBlock)
  const props = block.props ?? {}
  const content = <InlineText content={block.content} />
  const blockKey = getBlockKey(sourceBlock, path)

  switch (block.type) {
    case "button":
      return <a className="builder-button" data-variant={props.variant ?? "primary"} href={typeof props.href === "string" ? getSafeHref(props.href) : undefined}>{content}</a>
    case "heading": {
      const level = props.level === 1 || props.level === 2 ? props.level : 3
      const Heading = `h${level}` as "h1" | "h2" | "h3"
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
      return <pre><code>{typeof props.code === "string" ? props.code : ""}</code></pre>
    case "divider":
      return <hr />
    case "image":
      return typeof props.url === "string" && getSafeHref(props.url)
        ? <figure><Image src={getSafeHref(props.url)!} alt={typeof props.caption === "string" ? props.caption : ""} width={1200} height={675} sizes="(max-width: 768px) 100vw, 896px" className="h-auto w-full" /><figcaption>{typeof props.caption === "string" ? props.caption : ""}</figcaption></figure>
        : null
    case "video":
    case "audio":
    case "file":
      return typeof props.url === "string" && getSafeHref(props.url)
        ? <a href={getSafeHref(props.url)}>{typeof props.name === "string" ? props.name : props.url}</a>
        : null
    case "callout":
      return <aside className="editor-callout" data-tone={typeof props.tone === "string" ? props.tone : "info"} role="note"><span className="editor-callout-icon">{typeof props.icon === "string" ? props.icon : "💡"}</span><div><InlineText content={block.content} /></div></aside>
    case "youtube":
      return <YouTubeBlock props={props} />
    case "featureGrid":
      return <FeatureGridSection {...asFeatureGridProps(props)} />
    case "callToAction":
      return <CallToActionSection {...asCallToActionProps(props)} />
    case "toggleListItem":
      return <details><summary>{content}</summary><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></details>
    case "section":
      return <PageSection properties={asSectionProperties(props)}><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></PageSection>
    case "columns":
      return <PageColumns properties={asColumnsProperties(props)}><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></PageColumns>
    case "column":
      return <PageColumn><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></PageColumn>
    case "stack":
      return <PageStack properties={asStackProperties(props)}><BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></PageStack>
    case "pageCollection":
      return <PageCollection items={collections[blockKey] ?? []} layout={props.layout === "list" ? "list" : "grid"} />
    default:
      return <div>{content}<BlockChildren collections={collections} path={path}>{block.children}</BlockChildren></div>
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
    <div className="portfolio-block-renderer space-y-6">
      {content.map((sourceBlock, index) => {
        const path = String(index)
        return <div key={getBlockKey(sourceBlock, path)} className="portfolio-block" data-block-type={sourceBlock.type}><Block block={sourceBlock} collections={collections} path={path} /></div>
      })}
    </div>
  )
}
