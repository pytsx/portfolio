
import Link from "next/link"
import {
  ArrowUpRight,
  Layers3,
  ShieldCheck,
} from "lucide-react"
import type { Metadata } from "next"

import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Acesso",
  description: "Acesso à administração do portfólio.",
}

export default function AuthLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
      {/* Background */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Subtle radial glow */}

        <div
          className="
            absolute -top-64 left-1/2
            size-[600px] -translate-x-1/2
            rounded-full bg-primary/[0.035]
            blur-[100px]
            dark:bg-primary/[0.025]
          "
        />

        {/* Soft ambient light */}

        <div
          className="
            absolute bottom-0 right-0
            size-[400px] translate-x-1/3
            translate-y-1/3 rounded-full
            bg-muted/50 blur-[120px]
          "
        />
      </div>

      {/* Navigation */}

      <header className="relative z-10 w-full">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link
            href="/"
            aria-label="Voltar ao portfólio"
            className="
              group inline-flex items-center gap-2.5
              rounded-lg outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-4
              focus-visible:ring-offset-background
            "
          >
            <div
              className="
                flex size-8 items-center
                justify-center rounded-lg
                border border-border/80
                bg-card shadow-xs
                transition-colors duration-200
                group-hover:bg-accent
              "
            >
              <Layers3
                className="size-[17px]"
                strokeWidth={1.7}
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold leading-4 tracking-tight">
                Administração
              </span>

              <span className="text-[10px] leading-3 text-muted-foreground">
                Portfolio workspace
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="
              group inline-flex items-center
              gap-1.5 rounded-md px-2 py-1.5
              text-xs font-medium
              text-muted-foreground
              transition-colors duration-150
              hover:bg-accent/60
              hover:text-foreground
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring/50
            "
          >
            <span className="hidden sm:inline">
              Voltar ao portfólio
            </span>

            <span className="sm:hidden">
              Voltar
            </span>

            <ArrowUpRight
              className="
                size-3.5 transition-transform
                duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </header>

      {/* Authentication content */}

      <section
        aria-label="Autenticação administrativa"
        className="
          relative z-10 flex w-full flex-1
          items-center justify-center
          px-4 py-12 sm:px-6
        "
      >
        <div className="w-full max-w-[440px]">
          {/* Card */}

          <Card
            className="
              gap-0 overflow-hidden
              rounded-2xl
              border border-border/70
              bg-card/95 py-0
              shadow-xl shadow-foreground/[0.045]
              ring-1 ring-foreground/[0.015]
              backdrop-blur-sm
              dark:shadow-black/15
            "
          >
            {children}
          </Card>

          {/* Below card */}

          <div className="mt-6 flex items-center justify-center gap-2">
            <ShieldCheck
              className="size-3.5 text-muted-foreground/60"
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground/70">
              Ambiente de acesso restrito
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="relative z-10 w-full">
        <div
          className="
            mx-auto flex min-h-16 w-full
            max-w-7xl flex-col items-center
            justify-between gap-2
            px-6 py-5
            sm:flex-row sm:px-10
          "
        >
          <span className="text-[11px] text-muted-foreground/55">
            Portfolio · Administração
          </span>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/55">
            <span className="size-1 rounded-full bg-foreground/25" />

            <span>
              Área reservada
            </span>
          </div>
        </div>
      </footer>
    </main>
  )
}
