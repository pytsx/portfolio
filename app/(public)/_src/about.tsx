import { Badge } from "@/components/ui/badge";



export function About() {
  return (
    <section id="sobre" className="scroll-mt-28 py-20">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="space-y-5">
          <Badge variant="outline">02 / Sobre mim</Badge>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Mais do que
            <br />
            escrever código<span className="text-muted-foreground">.</span>
          </h2>
        </div>

        <div className="space-y-7">
          <p className="text-xl leading-9 tracking-tight sm:text-2xl">
            Acredito que boas experiências digitais nascem
            do equilíbrio entre{" "}
            <span className="font-semibold">
              engenharia, design e propósito.
            </span>
          </p>

          <p className="leading-8 text-muted-foreground">
            Meu trabalho envolve transformar problemas complexos
            em soluções simples e intuitivas. Gosto de pensar
            em cada detalhe da experiência, desde a arquitetura
            e a performance até as interações que tornam
            uma interface agradável de usar.
          </p>

          <p className="leading-8 text-muted-foreground">
            Estou sempre explorando novas ferramentas,
            aprimorando processos e buscando maneiras
            melhores de construir produtos para a web.
          </p>

        </div>
      </div>
    </section>
  )
}