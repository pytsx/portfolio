import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { publicSiteSettings } from "@/lib/site-settings"
import { cn } from "@/lib/utils"
import { siteOrigin } from "@/lib/public/url"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await publicSiteSettings.get()

  return {
    metadataBase: new URL(siteOrigin()),
    title: {
      default: settings.name,
      template: `%s | ${settings.name}`,
    },
    description: settings.description,
    openGraph: { type: "website", title: settings.name, description: settings.description },
    twitter: { card: "summary_large_image", title: settings.name, description: settings.description },
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
