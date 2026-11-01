import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { ProjectPreview } from "./project-preview";
import { Project } from "./type";


export function Projects(props: { projects: Project[] }) {
  return (
    <section id="projetos" className="scroll-mt-28 py-20">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="space-y-4">
          <Badge variant="outline">01 / Trabalhos</Badge>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Projetos em destaque<span className="text-muted-foreground">.</span>
          </h2>

          <p className="max-w-xl leading-7 text-muted-foreground">
            Uma seleção de projetos que exploram diferentes
            desafios, tecnologias e soluções.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {props.projects.map((project) => (
          <Card
            key={project.number}
            className="group gap-0 overflow-hidden py-0 shadow-none transition-colors hover:border-foreground/25"
          >
            <CardContent className="space-y-6 p-4 sm:p-5">
              <ProjectPreview variant={project.variant} />

              <div className="space-y-5 px-2 pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    {project.number} / {project.category}
                  </span>

                  <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <Badge
                      key={technology}
                      variant="secondary"
                      className="font-normal"
                    >
                      {technology}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
