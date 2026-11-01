import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";


export function Writing() {
  return (
    <section className="py-20">
      <Link href="/blog" className="group block">
        <div className="flex flex-col justify-between gap-8 rounded-2xl border bg-muted/30 p-8 transition-colors hover:bg-muted/60 sm:p-12 lg:flex-row lg:items-end">
          <div className="max-w-xl space-y-5">
            <Badge variant="outline">04 / Escrita</Badge>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Aprender, construir
              <br />
              e compartilhar<span className="text-muted-foreground">.</span>
            </h2>

            <p className="leading-7 text-muted-foreground">
              No blog compartilho experiências, ideias,
              aprendizados e reflexões sobre desenvolvimento
              web, tecnologia e o processo de criar.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium">
            Explorar o blog
            <span className="flex size-11 items-center justify-center rounded-full border bg-background transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight className="size-5" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  )
}