"use client"

import Link from "next/link"
import { FilePlus2, LayoutDashboard, LogIn, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type SessionUser = {
  id: string
  email: string | null
}

function getUserInitial(user: SessionUser) {
  return (user.email ?? "U").charAt(0).toLocaleUpperCase("pt-BR")
}

export function AccountMenuClient({ user }: { user: SessionUser | null }) {
  if (!user) {
    return <Button variant="ghost" size="sm" render={<Link href="/signin" />}><LogIn data-icon="inline-start" /> Entrar</Button>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button" className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="Abrir menu da conta" />}>
        {getUserInitial(user)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="grid gap-0.5">
            <span className="font-medium text-foreground">Administrador</span>
            <span className="truncate font-normal">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/admin" />}><LayoutDashboard /> Painel administrativo</DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/admin/pages?new=1" />}><FilePlus2 /> Nova página</DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/admin/settings" />}><Settings /> Configurações do portfólio</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" render={<Link href="/signout" />}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
