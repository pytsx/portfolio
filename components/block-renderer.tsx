/* eslint-disable @next/next/no-img-element */

import Link from "next/link"

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
  collections?: Record<number, BlockCollectionItem[]>
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

function BlockChildren({ children }: { children?: EditorDocument }) {
  if (!children?.length) return null
  return <div className="portfolio-block-children">{children.map((child) => <Block key={child.id ?? child.type} block={child} />)}</div>
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

function Block({ block: sourceBlock }: { block: EditorDocument[number] }) {
  const block = asRenderableBlock(sourceBlock)
  const props = block.props ?? {}
  const content = <InlineText content={block.content} />

  switch (block.type) {
    case "heading": {
      const level = props.level === 1 || props.level === 2 ? props.level : 3
      const Heading = `h${level}` as "h1" | "h2" | "h3"
      return <Heading><span>{content}</span></Heading>
    }
    case "bulletListItem":
      return <ul><li><span>{content}</span><BlockChildren>{block.children}</BlockChildren></li></ul>
    case "numberedListItem":
      return <ol><li><span>{content}</span><BlockChildren>{block.children}</BlockChildren></li></ol>
    case "checkListItem":
      return <div className="portfolio-check-list-item"><input type="checkbox" checked={props.checked === true} readOnly /><span>{content}</span></div>
    case "quote":
      return <blockquote>{content}<BlockChildren>{block.children}</BlockChildren></blockquote>
    case "codeBlock":
      return <pre><code>{typeof props.code === "string" ? props.code : ""}</code></pre>
    case "divider":
      return <hr />
    case "image":
      return typeof props.url === "string" && getSafeHref(props.url)
        ? <figure><img src={getSafeHref(props.url)} alt={typeof props.caption === "string" ? props.caption : ""} /><figcaption>{typeof props.caption === "string" ? props.caption : ""}</figcaption></figure>
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
    case "toggleListItem":
      return <details><summary>{content}</summary><BlockChildren>{block.children}</BlockChildren></details>
    default:
      return <div>{content}<BlockChildren>{block.children}</BlockChildren></div>
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
        <Link key={item.id} href={item.href} className="rounded-2xl border p-5 text-lg font-medium transition-colors hover:bg-muted">
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
      {content.map((sourceBlock, index) => sourceBlock.type === "pageCollection"
        ? <PageCollection key={sourceBlock.id ?? `collection-${index}`} items={collections[index] ?? []} layout={sourceBlock.props?.layout === "list" ? "list" : "grid"} />
        : <div key={sourceBlock.id ?? `block-${index}`} className="portfolio-block"><Block block={sourceBlock} /></div>)}
    </div>
  )
}
