import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Mail } from "lucide-react";
import { Profile } from "./type";

type Props = {
  profile: Profile
}
export function Contact(props: Props) {
  return (
    <section id="contato" className="scroll-mt-28 py-20">
      <div className="space-y-10 rounded-3xl bg-zinc-950 p-8 text-white sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <Badge className="border-white/20 bg-white/10 text-white">
            05 / Contato
          </Badge>
          <Mail className="size-5 text-zinc-500" />
        </div>

        <div className="space-y-6">
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl">
            Tem uma ideia?
            <br />
            <span className="text-zinc-500">
              Vamos construir juntos.
            </span>
          </h2>

          <p className="max-w-lg leading-8 text-zinc-400">
            Estou sempre aberto a conversar sobre novos
            projetos, oportunidades e ideias interessantes.
          </p>
        </div>

        <Button

          size="lg"
          className="bg-white text-zinc-950 hover:bg-zinc-200"
        >
          <a href={`mailto:${props.profile.email}`}>
            Iniciar uma conversa
            <ArrowUpRight className="size-4" />
          </a>
        </Button>
      </div>
    </section>
  )
}