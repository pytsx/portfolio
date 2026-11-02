import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { BlockPage } from "@/components/block-page"
import { getEditorDocumentText } from "@/components/editor/lib/document"
import { resolvePageCollections } from "@/lib/pages/render"
import { resolvePublicRoute } from "@/lib/public/route-resolver"
import { absoluteUrl } from "@/lib/public/url"

type Props = { params: Promise<{ path: string[] }> }

function pageDescription(title: string, custom: string | undefined, content: Parameters<typeof getEditorDocumentText>[0]) {
  return custom || getEditorDocumentText(content).replace(/\s+/g, " ").trim().slice(0, 160) || title
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params
  const resolved = await resolvePublicRoute(path.join("/"))
  if (!resolved) return { title: "Página não encontrada", robots: { index: false, follow: false } }
  const entity = resolved.entity
  const description = pageDescription(entity.title, resolved.kind === "page" ? resolved.entity.description : undefined, entity.content)
  const images = resolved.kind === "page" && resolved.entity.coverImage
    ? [resolved.entity.coverImage]
    : [absoluteUrl(`/og?title=${encodeURIComponent(entity.title)}`)]
  const canonical = absoluteUrl(resolved.path)

  return {
    title: entity.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: resolved.kind === "page" ? "article" : "website",
      title: entity.title, description, url: canonical, images,
      ...(resolved.kind === "page" ? { publishedTime: entity.createdAt?.toISOString(), modifiedTime: entity.updatedAt?.toISOString() } : {}),
    },
    twitter: { card: "summary_large_image", title: entity.title, description, images },
  }
}

async function ResolvedContent({ params }: Props) {
  const { path } = await params
  const resolved = await resolvePublicRoute(path.join("/"))
  if (!resolved) notFound()
  const entity = resolved.entity
  const collections = await resolvePageCollections(entity.content, resolved.kind === "group" ? resolved.entity.slug : undefined, resolved.kind === "group" ? resolved.entity.id : resolved.entity.groupId)
  return <BlockPage title={entity.title} content={entity.content} collections={collections} width={resolved.kind === "page" ? resolved.entity.width : undefined} />
}

export default function DynamicContentPage(props: Props) {
  return <Suspense fallback={<div className="min-h-96" />}><ResolvedContent {...props} /></Suspense>
}
