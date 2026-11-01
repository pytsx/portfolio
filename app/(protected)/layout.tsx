import { SidebarProvider } from "@/components/ui/sidebar";
import { requireAuthenticatedUser } from "@/lib/auth/server";
import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { AdminSidebar } from "./_src/admin-sidebar";
import { groupRepository } from "@/lib/groups/server";
import { pageRepository } from "@/lib/pages/server";

export const metadata: Metadata = {
  title: "Administração | Henrique Pessoa",
  description: "Gerenciamento do conteúdo do portfólio.",
};

async function AuthenticatedShell({ children }: { children: ReactNode }) {
  await connection()
  const user = await requireAuthenticatedUser()
  const [groups, pages] = await Promise.all([
    groupRepository.list(),
    pageRepository.list(),
  ])

  return (
    <SidebarProvider>
      <AdminSidebar groups={groups} pages={pages} user={user} />
      <main className="min-w-0 flex-1">
        {children}
      </main>
    </SidebarProvider>
  )
}

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </Suspense>
  )
}


