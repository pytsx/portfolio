import Link from "next/link";
import { Social } from "./type";

type Props = {
  logo: React.ReactNode
  socials: Social[]
}

export async function Footer({ logo, socials }: Props) {

  return (

    <footer className="p-5">
      <div className="flex flex-col justify-between gap-5 text-sm text-muted-foreground sm:flex-row sm:items-center">
          {logo}

        <div className="flex items-center gap-6">
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>

          {socials.map((social) => (
            <a
              key={social.name}
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