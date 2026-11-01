
import { posts } from "@/lib/posts"
import { connection } from "next/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

import { ArrowLeft, BookOpen, ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  params: Promise<{ slug: string }>
}

async function PostContent({ params }: Props) {
  await connection()

  const { slug } = await params
  const post = await posts.get(slug)

  if (!post) notFound()

  return (
    <article className="mx-auto w-full max-w-3xl">
      <header className="mb-12 space-y-8">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1.5">
            <BookOpen className="size-3.5" />
            Artigo
          </Badge>
          <span className="text-sm text-muted-foreground">
            Blog
          </span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {post.title}
        </h1>

        <Separator />
      </header>

      <div className="text-base leading-8 whitespace-pre-wrap text-foreground/85 sm:text-lg">
        {post.content}
      </div>

      <footer className="mt-20 space-y-8">
        <Separator />

        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="font-medium">
              Obrigado pela leitura.
            </p>
            <p className="text-sm text-muted-foreground">
              Explore outros conteúdos do blog.
            </p>
          </div>

          <Button variant="outline">
            <Link href="/blog" className="flex items-center space-x-2">
              <span>Ver outros artigos</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </footer>
    </article>
  )
}

function PostSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <Skeleton className="h-6 w-24 rounded-full" />

      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-4/5" />
      </div>

      <Separator />

      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-5 w-full"
          />
        ))}
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  )
}

export default function BlogPostPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <nav className="mb-16">
          <Button
            
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground"
          >
            <Link href="/blog" className="flex items-center space-x-2">
              <ArrowLeft className="size-4" />
              <span>
                Voltar ao blog
              </span>
            </Link>
          </Button>
        </nav>

        <Suspense fallback={<PostSkeleton />}>
          <PostContent params={params} />
        </Suspense>
      </div>
    </main>
  )
}
