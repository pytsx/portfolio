
import type { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { Hero } from "./_src/hero"
import { Projects } from "./_src/projects"
import { About } from "./_src/about"
import { TechStack } from "./_src/tech-stack"
import { Writing } from "./_src/writing"
import { Contact } from "./_src/contact"
import { Profile, Project } from "./_src/type"

export const metadata: Metadata = {
  title: "Seu Nome | Desenvolvedor Web",
  description:
    "Portfólio de desenvolvedor web especializado em aplicações e experiências digitais.",
}

const profile: Profile = {
  name: "Seu Nome",
  email: "voce@exemplo.com",
  socials: [
    { name: "GitHub", href: "https://github.com/seu-usuario" },
    { name: "LinkedIn", href: "https://linkedin.com/in/seu-usuario" },
    { name: "Twitter", href: "https://twitter.com/seu-usuario" },
  ],
};

const projects: Project[] = [
  {
    number: "01",
    title: "Atlas Dashboard",
    category: "Dashboard / SaaS",
    description:
      "Uma plataforma de análise de dados com foco em visualização, performance e experiência do usuário.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    variant: "dashboard" as const,
  },
  {
    number: "02",
    title: "Commerce",
    category: "E-commerce",
    description:
      "Uma experiência de compras moderna, com interface intuitiva e componentes reutilizáveis.",
    technologies: ["React", "Next.js", "shadcn/ui"],
    variant: "commerce" as const,
  },
  {
    number: "03",
    title: "Editorial",
    category: "Plataforma de conteúdo",
    description:
      "Uma plataforma de publicação com foco em conteúdo, legibilidade e design editorial.",
    technologies: ["Next.js", "Firebase", "TypeScript"],
    variant: "editorial" as const,
  },
]

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Tailwind CSS",
  "shadcn/ui",
  "PostgreSQL",
  "Firebase",
  "Git",
]

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <Hero profile={profile} />
      <Separator />
      <Projects projects={projects} />
      <Separator />
      <About />
      <Separator />
      <TechStack technologies={technologies} />
      <Separator />
      <Writing />
      <Contact profile={profile} />
    </div>
  )
}
