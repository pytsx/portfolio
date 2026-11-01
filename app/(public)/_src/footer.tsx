import Link from "next/link";
import type { SocialLink } from "@/lib/socials";

type Props = {
  logo: React.ReactNode
  socials: SocialLink[]
}

export function Footer({ logo, socials }: Props) {

  return (

    <footer className="p-5">
      <div className="flex flex-col justify-between gap-5 text-sm text-muted-foreground sm:flex-row sm:items-center">
          {logo}

        <div className="flex items-center gap-6">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {social.name}
            </a>
          ))}

          
          <Link href="#" className="hover:text-foreground">
            Voltar ao topo ↑
          </Link>
        </div>
      </div>
    </footer>
  )
}
