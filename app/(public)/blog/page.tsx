
import { posts } from "@/lib/posts"
import { connection } from "next/server"
import Link from "next/link"
import { Suspense } from "react"
import type { Metadata } from "next"

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  PenLine,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Blog",
  description: "Artigos, ideias e reflexões sobre tecnologia.",
}

function getExcerpt(content: string, limit = 160) {
  const text = content
    .replace(/[#*_`>[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  return text.length > limit
    ? `${text.slice(0, limit).trimEnd()}…`
    : text
}

async function PostsList() {
  await connection()

  const allPosts = await posts.list()

  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-24 text-center">
        <BookOpen className="mb-5 size-10 text-muted-foreground/50" />

        <h2 className="text-xl font-semibold">
          Nenhum artigo publicado
        </h2>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Ainda não existem publicações por aqui.
          Volte em breve para conferir novos conteúdos.
        </p>
      </div>
    )
  }

  const [featured, ...remaining] = allPosts

  return (
    <div className="space-y-16">
      {/* Artigo em destaque */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">
            Em destaque
          </h2>

          <span className="text-xs text-muted-foreground">
            01 / {String(allPosts.length).padStart(2, "0")}
          </span>
        </div>

        <Link
          href={`/blog/${featured.id}`}
          className="group block"
        >
          <Card className="gap-0 overflow-hidden border-border/70 bg-muted/30 py-0 shadow-none transition-colors hover:bg-muted/60">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col gap-12 sm:gap-20">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="gap-1.5">
                    <PenLine className="size-3" />
                    Artigo
                  </Badge>

                  <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>

                <div className="max-w-2xl space-y-5">
                  <h3 className="text-3xl font-semibold leading-tight tracking-tight text-balance transition-colors group-hover:text-foreground/70 sm:text-5xl">
                    {featured.title}
                  </h3>

                  <p className="max-w-xl text-base leading-7 text-muted-foreground">
                    {getExcerpt(featured.content, 220)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium">
                  Ler artigo
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Outros artigos */}
      {remaining.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Todos os artigos
              </h2>

              <p className="text-sm text-muted-foreground">
                Explore os conteúdos mais recentes.
              </p>
            </div>

            <span className="shrink-0 text-sm text-muted-foreground">
              {remaining.length} publicações
            </span>
          </div>

          <Separator />

          <div className="grid gap-5 md:grid-cols-2">
            {remaining.map((post, index) => (
              <Link
                key={post.title}
                href={`/blog/${post.id}`}
                className="group block h-full"
              >
                <Card className="flex h-full flex-col gap-0 py-0 shadow-none transition-colors hover:border-foreground/25 hover:bg-muted/30">
                  <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 2).padStart(2, "0")}
                    </span>

                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4 p-6 pt-10">
                    <Badge variant="outline">
                      Artigo
                    </Badge>

                    <h3 className="text-xl font-semibold leading-snug tracking-tight text-balance sm:text-2xl">
                      {post.title}
                    </h3>

                    <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                      {getExcerpt(post.content)}
                    </p>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      Continuar lendo
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function PostsSkeleton() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <Skeleton className="h-4 w-24" />

        <div className="space-y-8 rounded-xl border p-8 sm:p-12">
          <Skeleton className="h-6 w-24" />

          <div className="space-y-4">
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-5 w-full max-w-lg" />
            <Skeleton className="h-5 w-3/4 max-w-lg" />
          </div>

          <Skeleton className="h-5 w-28" />
        </div>
      </section>

      <section className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Separator />

        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-6 rounded-xl border p-6"
            >
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-6 w-20" />
              <div className="space-y-3">
                <Skeleton className="h-7 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
        <header className="mb-16 max-w-3xl space-y-7">
          <Badge variant="outline" className="gap-2">
            <BookOpen className="size-3.5" />
            Blog
          </Badge>

          <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Ideias, códigos
            <br />
            <span className="text-muted-foreground">
              e experiências.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Um espaço para compartilhar conhecimento,
            explorar novas tecnologias e documentar
            aprendizados ao longo do caminho.
          </p>
        </header>

        <Separator className="mb-12" />

        <Suspense fallback={<PostsSkeleton />}>
          <PostsList />
        </Suspense>

        <footer className="mt-24 border-t pt-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="font-medium">
                Continue explorando.
              </p>
              <p className="text-sm text-muted-foreground">
                Conheça mais sobre meus projetos e experiências.
              </p>
            </div>

            <Button variant="outline">
              <Link href="/" className="flex items-center space-x-2">
                <span>
                  Voltar ao início
                </span>
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </footer>
      </div>
    </main>
  )
}
