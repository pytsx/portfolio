"use client"

import { AppSidebar, type NavigationGroup } from "@/components/sidebar"
import React from "react"
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  FileText,
  FilePenLine,
  FolderOpen,
  Tags,
  Images,
  MessageSquare,
  Settings2,
} from "lucide-react"

const content = [
      {
        id: "general",
        label: "Geral",
        items: [
          {
            id: "dashboard",
            title: "Visão geral",
            url: "/admin",
            icon: LayoutDashboard,
          },
          {
            id: "analytics",
            title: "Estatísticas",
            url: "/admin/analytics",
            icon: ChartNoAxesCombined,
          },
        ],
      },
      {
        id: "content",
        label: "Conteúdo",
        items: [
          {
            id: "posts",
            title: "Publicações",
            url: "/admin/posts",
            icon: FileText,
          },
          {
            id: "drafts",
            title: "Rascunhos",
            url: "/admin/drafts",
            icon: FilePenLine,
          },
          {
            id: "categories",
            title: "Categorias",
            url: "/admin/categories",
            icon: FolderOpen,
          },
          {
            id: "tags",
            title: "Tags",
            url: "/admin/tags",
            icon: Tags,
          },
          {
            id: "media",
            title: "Biblioteca de mídia",
            url: "/admin/media",
            icon: Images,
          },
        ],
      },
      {
        id: "management",
        label: "Gerenciamento",
        items: [
          {
            id: "comments",
            title: "Comentários",
            url: "/admin/comments",
            icon: MessageSquare,
          },
          {
            id: "settings",
            title: "Configurações",
            url: "/admin/settings",
            icon: Settings2,
          },
        ],
      },
    ]

export function AdminSidebar() {
  const [navigation, setNavigation] =
    React.useState<NavigationGroup[]>(content)

  return (
    <AppSidebar
    catalog={content}
      navigation={navigation}
      onNavigationChange={setNavigation}
    />
  )
}
