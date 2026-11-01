import { Badge } from "@/components/ui/badge";
import { Code2 } from "lucide-react";

type Props = {
  technologies: string[];
}
export function TechStack(props: Props) {
  return (
    <section id="tecnologias" className="scroll-mt-28 py-20">
      <div className="space-y-6">
        <Badge variant="outline">03 / Ferramentas</Badge>

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Minha stack<span className="text-muted-foreground">.</span>
          </h2>

          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Tecnologias que utilizo para construir aplicações
            modernas, escaláveis e bem estruturadas.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-5">
          {props.technologies.map((technology) => (
            <div
              key={technology}
              className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Code2 className="size-4 text-muted-foreground" />
              {technology}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}