import { Appbar } from "./_src/appbar";
import { Menu } from "./_src/menu";
import { menus } from "@/lib/menu";
import { Separator } from "@/components/ui/separator";
import { Footer } from "./_src/footer";
import { Suspense } from "react";
import { publicSocials } from "@/lib/socials";
import { publicSiteSettings } from "@/lib/site-settings";


async function getPublicLayoutData() {
  const [[menu], settings] = await Promise.all([menus.list(), publicSiteSettings.get()])
  return { menu: menu?.items ?? [], settings }
}
async function PublicNavigation() {
  const { menu, settings } = await getPublicLayoutData()

  return (
    <Appbar>
      <div>{settings.logo || settings.name}</div>
      <Menu items={menu} />
    </Appbar>
  )
}

async function PublicFooter() {
  const [socials, settings] = await Promise.all([publicSocials.list(), publicSiteSettings.get()])

  return <Footer logo={<div>{settings.logo || settings.name}</div>} socials={socials} />
}

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <Suspense fallback={<Appbar><div></div></Appbar>}>
        <PublicNavigation />
      </Suspense>

      <main className="flex-1">{children}</main>
      <Separator className="mb-4" />

      <Suspense fallback={<footer className="p-5" />}>
        <PublicFooter />
      </Suspense>
    </div>
  )
}
