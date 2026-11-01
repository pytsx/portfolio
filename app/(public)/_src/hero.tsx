import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";
import { Profile } from "./type";

type Props = {
  profile: Profile;
};

export function Hero(props: Props) {
  return (
    <section className="grid items-center gap-14 py-20 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:py-32">
      <div className="space-y-8">
        <Badge variant="outline" className="gap-2 px-3 py-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          Desenvolvedor Web
        </Badge>

        <div className="space-y-6">
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Criando para
            <br />
            a web<span className="text-muted-foreground">,</span>
            <br />
            pensando além
            <span className="text-muted-foreground"> do código.</span>
          </h1>

          <p className="max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
            Olá, eu sou {props.profile.name}. Desenvolvo aplicações
            web modernas, combinando tecnologia, design
            e atenção aos detalhes para criar experiências
            que fazem a diferença.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button  size="lg">
            <Link href="#projetos">
              Explorar projetos
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>

          <Button  size="lg" variant="outline">
            <a href={`mailto:${props.profile.email}`}>
              Entrar em contato
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-3 pt-6 text-sm text-muted-foreground">
          <ArrowDown className="size-4" />
          Role para descobrir mais
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-muted/40 blur-2xl" />

        <div className="relative overflow-hidden rounded-2xl border bg-zinc-950 text-zinc-100 shadow-2xl">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-5">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-green-400/80" />
            </div>

            <span className="font-mono text-xs text-zinc-500">
              developer.ts
            </span>

            <Terminal className="size-4 text-zinc-500" />
          </div>

          <div className="space-y-7 p-6 font-mono text-sm sm:p-9">
            <div className="space-y-2">
              <p className="text-zinc-500">
                // um pouco sobre mim
              </p>

              <p>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-300">developer</span>{" "}
                <span className="text-zinc-400">= {"{"}</span>
              </p>

              <div className="space-y-2 pl-5">
                <p>
                  <span className="text-emerald-300">name</span>:{" "}
                  <span className="text-amber-200">
                    "{props.profile.name}"
                  </span>,
                </p>

                <p>
                  <span className="text-emerald-300">focus</span>:{" "}
                  <span className="text-amber-200">
                    "Web Development"
                  </span>,
                </p>

                <p>
                  <span className="text-emerald-300">passion</span>:{" "}
                  <span className="text-amber-200">
                    "Building things"
                  </span>,
                </p>

                <p>
                  <span className="text-emerald-300">learning</span>:{" "}
                  <span className="text-blue-300">true</span>,
                </p>
              </div>

              <p className="text-zinc-400">{"}"}</p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-zinc-500">
                // o que me motiva
              </p>

              <p className="mt-3 leading-7">
                <span className="text-purple-400">function</span>{" "}
                <span className="text-blue-300">build</span>
                <span className="text-zinc-400">() {"{"}</span>
              </p>

              <p className="pl-5 leading-7">
                <span className="text-purple-400">return</span>{" "}
                <span className="text-amber-200">
                  "Ideas into reality"
                </span>
              </p>

              <p className="text-zinc-400">{"}"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </div>

            <span className="font-mono text-xs text-zinc-500">
              TypeScript
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}