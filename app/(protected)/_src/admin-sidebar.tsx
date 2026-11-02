
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Layers3,
  Menu,
  Plus,
  Search,
  Share2,
  Settings,
  UserRound,
  X,
} from "lucide-react"

import type { AuthenticatedUser } from "@/lib/auth/server"
import type { SidebarGroup as SidebarNavigationGroup, SidebarPage } from "@/lib/admin/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePageStructure, type PageLayerNode } from "@/components/editor/page-structure-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// -------------------------------------------
// Helpers
// -------------------------------------------

function createPageHref(parentId?: string) {
  if (!parentId) return "/admin/pages?new=1"

  return `/admin/pages?new=1&groupId=${encodeURIComponent(parentId)}`
}

function createGroupHref(parentId?: string) {
  if (!parentId) return "/admin/groups?new=1"

  return `/admin/groups?new=1&parentId=${encodeURIComponent(parentId)}`
}

function matchesSearch(value: string, query: string) {
  return value.toLocaleLowerCase("pt-BR").includes(query)
}

function isPageInParent(
  page: SidebarPage,
  parentId: string | undefined,
  groups: SidebarNavigationGroup[]
) {
  if (page.groupId) {
    return page.groupId === parentId
  }

  if (page.groupSlug) {
    const parentGroup = groups.find(
      (group) => group.id === parentId
    )

    return parentGroup
      ? page.groupSlug === parentGroup.slug
      : false
  }

  return parentId === undefined
}

function hasMatchingContent(
  group: SidebarNavigationGroup,
  groups: SidebarNavigationGroup[],
  pages: SidebarPage[],
  query: string,
  visited: Set<string> = new Set()
): boolean {
  if (visited.has(group.id)) return false

  const nextVisited = new Set(visited)
  nextVisited.add(group.id)

  if (matchesSearch(group.title, query)) {
    return true
  }

  const hasPage = pages.some(
    (page) =>
      isPageInParent(page, group.id, groups) &&
      matchesSearch(page.title, query)
  )

  if (hasPage) return true

  return groups.some(
    (child) =>
      child.parentId === group.id &&
      hasMatchingContent(
        child,
        groups,
        pages,
        query,
        nextVisited
      )
  )
}

// -------------------------------------------
// Small UI components
// -------------------------------------------

type ActionLinkProps = {
  href: string
  label: string
  children: React.ReactNode
}

function ActionLink({
  href,
  label,
  children,
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="
        inline-flex size-6 shrink-0 items-center
        justify-center rounded-md
        text-sidebar-foreground/50
        transition-colors duration-150
        hover:bg-sidebar-accent
        hover:text-sidebar-accent-foreground
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-sidebar-ring
      "
    >
      {children}
    </Link>
  )
}

// -------------------------------------------
// Page
// -------------------------------------------

type TreePageItemProps = {
  page: SidebarPage
  depth: number
  pathname: string
  onOpen?: () => void
}

function TreePageItem({
  page,
  depth,
  pathname,
  onOpen,
}: TreePageItemProps) {
  const href = `/admin/pages/${page.id}/edit`
  const active = pathname === href

  return (
    <Link
      href={href}
      title={page.title}
      aria-current={active ? "page" : undefined}
      onClick={onOpen}
      style={{
        paddingLeft: 8 + depth * 16,
      }}
      className={`
        group/page
        flex min-h-8 w-full min-w-0 items-center
        gap-1 rounded-md pr-2
        text-[13px] leading-5
        transition-colors duration-150
        ${
          active
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
        }
        ${page.isHome ? "sidebar-main-page" : ""}
      `}
    >
      <span className="size-5 shrink-0" />

      <FileText
        className="
          size-[17px] shrink-0
          text-sidebar-foreground/50
          group-hover/page:text-sidebar-foreground/80
        "
        strokeWidth={1.75}
      />

      <span className="min-w-0 flex-1 truncate px-1">
        {page.title}
      </span>
    </Link>
  )
}

// -------------------------------------------
// Group
// -------------------------------------------

type TreeGroupItemProps = {
  group: SidebarNavigationGroup
  groups: SidebarNavigationGroup[]
  pages: SidebarPage[]
  depth: number
  pathname: string
  query: string
  showAll: boolean
  ancestors: Set<string>
  onOpenPage?: (pageId: string) => void
  onOpenGroup?: (groupId: string) => void
}

function TreeGroupItem({
  group,
  groups,
  pages,
  depth,
  pathname,
  query,
  showAll,
  ancestors,
  onOpenPage,
  onOpenGroup,
}: TreeGroupItemProps) {
  const [open, setOpen] = React.useState(true)

  const expanded = query.length > 0 ? true : open

  const href = `/admin/groups/${group.id}/edit`
  const active = pathname === href

  const groupMatches =
    query.length > 0 &&
    matchesSearch(group.title, query)

  return (
    <div className="w-full min-w-0">
      <div
        style={{
          paddingLeft: 8 + depth * 16,
        }}
        className={`
          group/item
          flex min-h-8 w-full min-w-0 items-center
          rounded-md pr-1
          transition-colors duration-150
          ${
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/75 hover:bg-sidebar-accent/70"
          }
        `}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={
            expanded
              ? `Recolher ${group.title}`
              : `Expandir ${group.title}`
          }
          aria-expanded={expanded}
          disabled={query.length > 0}
          className="
            flex size-5 shrink-0 items-center
            justify-center rounded
            text-sidebar-foreground/45
            hover:bg-sidebar-accent
            hover:text-sidebar-foreground
            disabled:cursor-default
          "
        >
          <ChevronRight
            className={`
              size-3.5 transition-transform
              duration-200 ease-out
              ${expanded ? "rotate-90" : ""}
            `}
            strokeWidth={2}
          />
        </button>

        <Link
          href={href}
          onClick={() => onOpenGroup?.(group.id)}
          title={group.title}
          aria-current={active ? "page" : undefined}
          className="
            flex min-h-8 min-w-0 flex-1
            items-center gap-1.5 text-[13px]
            leading-5 hover:text-sidebar-foreground
          "
        >
          {expanded ? (
            <FolderOpen
              className="size-[17px] shrink-0 text-sidebar-foreground/55"
              strokeWidth={1.75}
            />
          ) : (
            <Folder
              className="size-[17px] shrink-0 text-sidebar-foreground/55"
              strokeWidth={1.75}
            />
          )}

          <span
            className={`
              min-w-0 flex-1 truncate
              ${active ? "font-medium" : ""}
            `}
          >
            {group.title}
          </span>
        </Link>

        <div
          className="
            flex shrink-0 items-center gap-0.5
            opacity-100 transition-opacity
            md:opacity-0
            md:group-hover/item:opacity-100
            md:group-focus-within/item:opacity-100
          "
        >
          <ActionLink
            href={createPageHref(group.id)}
            label={`Nova página em ${group.title}`}
          >
            <Plus className="size-3.5" />
          </ActionLink>

          <ActionLink
            href={createGroupHref(group.id)}
            label={`Novo subgrupo em ${group.title}`}
          >
            <FolderPlus className="size-3.5" />
          </ActionLink>
        </div>
      </div>

      {expanded && (
        <ContentTree
          groups={groups}
          pages={pages}
          parentId={group.id}
          depth={depth + 1}
          pathname={pathname}
          query={query}
          showAll={showAll || groupMatches}
          ancestors={new Set([...ancestors, group.id])}
          onOpenPage={onOpenPage}
          onOpenGroup={onOpenGroup}
        />
      )}
    </div>
  )
}

// -------------------------------------------
// Recursive content tree
// -------------------------------------------

type ContentTreeProps = {
  groups: SidebarNavigationGroup[]
  pages: SidebarPage[]
  parentId?: string
  depth?: number
  pathname: string
  query: string
  showAll?: boolean
  ancestors?: Set<string>
  onOpenPage?: (pageId: string) => void
  onOpenGroup?: (groupId: string) => void
}

function ContentTree({
  groups,
  pages,
  parentId,
  depth = 0,
  pathname,
  query,
  showAll = false,
  ancestors = new Set<string>(),
  onOpenPage,
  onOpenGroup,
}: ContentTreeProps) {
  const childPages = pages.filter(
    (page) =>
      isPageInParent(page, parentId, groups) &&
      (!query ||
        showAll ||
        matchesSearch(page.title, query))
  )

  const childGroups = groups.filter(
    (group) =>
      group.parentId === parentId &&
      !ancestors.has(group.id) &&
      (!query ||
        showAll ||
        hasMatchingContent(group, groups, pages, query))
  )

  if (
    query &&
    childPages.length === 0 &&
    childGroups.length === 0
  ) {
    if (parentId !== undefined) return null

    return (
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <Search
          className="mb-3 size-5 text-muted-foreground/40"
          strokeWidth={1.5}
        />
        <p className="text-xs font-medium text-sidebar-foreground/70">
          Nenhum resultado
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Tente buscar outro nome.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-px">
      {childPages.map((page) => (
        <TreePageItem
          key={page.id}
          page={page}
          depth={depth}
          pathname={pathname}
          onOpen={() => onOpenPage?.(page.id)}
        />
      ))}

      {childGroups.map((group) => (
        <TreeGroupItem
          key={group.id}
          group={group}
          groups={groups}
          pages={pages}
          depth={depth}
          pathname={pathname}
          query={query}
          showAll={showAll}
          ancestors={ancestors}
          onOpenPage={onOpenPage}
          onOpenGroup={onOpenGroup}
        />
      ))}
    </div>
  )
}

function PageLayersTree({
  layers,
  depth = 0,
  selectedBlockId,
  onSelect,
}: {
  layers: PageLayerNode[]
  depth?: number
  selectedBlockId?: string
  onSelect: (blockId: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-col gap-px">
      {layers.map((layer) => {
        const selected = layer.id === selectedBlockId
        return (
          <React.Fragment key={layer.id}>
            <button
              type="button"
              onClick={() => onSelect(layer.id)}
              aria-current={selected ? "true" : undefined}
              title={layer.label}
              style={{ paddingLeft: 8 + depth * 16 }}
              className={`group/layer flex min-h-8 w-full min-w-0 items-center gap-1 rounded-md pr-2 text-left text-[13px] leading-5 transition-colors duration-150 ${selected ? "sidebar-main-page font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"}`}
            >
              <span className="flex size-5 shrink-0 items-center justify-center">
                {layer.children.length > 0 ? <ChevronRight className="size-3.5 rotate-90 text-sidebar-foreground/45" /> : null}
              </span>
              {layer.children.length > 0
                ? <Layers3 className="size-[17px] shrink-0 text-sidebar-foreground/55" strokeWidth={1.75} />
                : <FileText className="size-[17px] shrink-0 text-sidebar-foreground/50" strokeWidth={1.75} />}
              <span className="min-w-0 flex-1 truncate px-1">{layer.label}</span>
            </button>
            {layer.children.length > 0 ? <PageLayersTree layers={layer.children} depth={depth + 1} selectedBlockId={selectedBlockId} onSelect={onSelect} /> : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// -------------------------------------------
// Sidebar
// -------------------------------------------

type AdminSidebarProps = {
  groups: SidebarNavigationGroup[]
  pages: SidebarPage[]
  user: AuthenticatedUser
}

export function AdminSidebar({
  groups,
  pages,
  user,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { page: pageStructure, selectedBlockId, selectFromSidebar } = usePageStructure()
  const editorEntity = pathname.match(/^\/admin\/(pages|groups)\/([^/]+)\/edit$/)
  const editorEntityType = editorEntity?.[1]
  const editorPageId = editorEntity?.[2]
  const [pagesModeFor, setPagesModeFor] = React.useState<string>()
  const showPageLayers = Boolean(editorPageId && pagesModeFor !== editorPageId)
  const activePageStructure = pageStructure?.pageId === editorPageId ? pageStructure : undefined
  const currentPageTitle = activePageStructure?.pageTitle
    ?? (editorEntityType === "groups" ? groups.find((group) => group.id === editorPageId)?.title : pages.find((page) => page.id === editorPageId)?.title)
    ?? "Página"

  const [searchOpen, setSearchOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const query = search
    .trim()
    .toLocaleLowerCase("pt-BR")
  const rootPages = pages.filter((page) =>
    isPageInParent(page, undefined, groups),
  )
  const rootGroups = groups.filter((group) => group.parentId === undefined)

  function closeSearch() {
    setSearch("")
    setSearchOpen(false)
  }

  function openSearch() {
    setSearchOpen(true)
  }

  React.useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus()
    }
  }, [searchOpen])

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border/60"
    >
      {/* Workspace header */}

      <SidebarHeader className="h-[69px] border-b border-sidebar-border/50 p-2">
        <div className="flex h-full items-center gap-2 px-1">
          <Link
            href="/admin"
            title="Administração"
            className="
              flex size-8 shrink-0 items-center
              justify-center rounded-lg
              bg-sidebar-primary
              text-sidebar-primary-foreground
              group-data-[collapsible=icon]:hidden
            "
          >
            <Layers3 className="size-[17px]" strokeWidth={1.75} />
          </Link>

          <Link
            href="/admin"
            className="
              flex min-w-0 flex-1 flex-col
              justify-center gap-0.5
              group-data-[collapsible=icon]:hidden
            "
          >
            <span className="truncate text-[13px] font-semibold leading-4 text-sidebar-foreground">
              Administração
            </span>

            <span className="truncate text-[11px] leading-3 text-muted-foreground">
              Workspace
            </span>
          </Link>

          <SidebarTrigger
            className="
              size-7 shrink-0 rounded-md
              text-sidebar-foreground/60
              hover:bg-sidebar-accent
              hover:text-sidebar-foreground
            "
          />
        </div>
      </SidebarHeader>

      {/* Main content */}

      <SidebarContent className="gap-0">
        {/* Expanded navigation */}

        <div className="group-data-[collapsible=icon]:hidden">
          {showPageLayers ? (
            <SidebarGroup className="p-0 pt-3">
              <div className="flex items-center gap-2 px-2 pb-3">
                <button
                  type="button"
                  onClick={() => setPagesModeFor(editorPageId)}
                  aria-label="Voltar para a árvore de páginas"
                  title="Voltar para páginas"
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-sidebar-foreground">{currentPageTitle}</p>
                  <p className="text-[11px] text-muted-foreground">Estrutura da página</p>
                </div>
              </div>
              <div className="flex h-9 items-center px-4 text-[11px] font-semibold tracking-[0.035em] text-sidebar-foreground/50">ELEMENTOS</div>
              <SidebarGroupContent className="px-2">
                {activePageStructure ? (
                  <PageLayersTree layers={activePageStructure.layers} selectedBlockId={selectedBlockId} onSelect={selectFromSidebar} />
                ) : (
                  <p className="px-2 py-4 text-xs text-muted-foreground">Carregando estrutura...</p>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          ) : <>
          {/* Search */}

          <div className="px-2 pb-2 pt-3">
            {searchOpen ? (
              <div
                className="
                  flex h-8 items-center gap-2
                  rounded-md border border-sidebar-border
                  bg-sidebar-accent/40 px-2
                  focus-within:ring-1
                  focus-within:ring-sidebar-ring
                "
              >
                <Search className="size-4 shrink-0 text-muted-foreground" />

                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      closeSearch()
                    }
                  }}
                  placeholder="Buscar páginas..."
                  aria-label="Buscar páginas e grupos"
                  className="
                    h-full min-w-0 flex-1 bg-transparent
                    text-xs text-sidebar-foreground
                    outline-none placeholder:text-muted-foreground
                  "
                />

                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Fechar busca"
                  className="
                    rounded p-0.5
                    text-muted-foreground
                    hover:text-sidebar-foreground
                  "
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openSearch}
                className="
                  flex h-8 w-full items-center gap-2
                  rounded-md px-2 text-[13px]
                  text-sidebar-foreground/65
                  transition-colors
                  hover:bg-sidebar-accent/70
                  hover:text-sidebar-foreground
                "
              >
                <Search className="size-4" strokeWidth={1.75} />
                <span>Buscar</span>
              </button>
            )}
          </div>

          {/* Index */}

          <SidebarGroup className="p-0">
            <div className="flex h-9 items-center justify-between px-4">
              <span
                className="
                  text-[11px] font-semibold
                  tracking-[0.035em]
                  text-sidebar-foreground/50
                "
              >
                PÁGINAS
              </span>

              <div className="flex items-center gap-0.5">
                <ActionLink
                  href={createGroupHref()}
                  label="Criar grupo"
                >
                  <FolderPlus className="size-4" strokeWidth={1.75} />
                </ActionLink>

                <ActionLink
                  href={createPageHref()}
                  label="Criar página"
                >
                  <Plus className="size-4" strokeWidth={1.75} />
                </ActionLink>
              </div>
            </div>

            <SidebarGroupContent className="px-2">
              <ContentTree
                groups={groups}
                pages={pages}
                pathname={pathname}
                query={query}
                onOpenPage={() => setPagesModeFor(undefined)}
                onOpenGroup={() => setPagesModeFor(undefined)}
              />

              {!query && (
                <Link
                  href={createPageHref()}
                  className="
                    mt-1 flex h-8 items-center
                    gap-2 rounded-md px-2
                    text-[13px] text-sidebar-foreground/45
                    transition-colors
                    hover:bg-sidebar-accent/70
                    hover:text-sidebar-foreground
                  "
                >
                  <Plus className="size-4" strokeWidth={1.75} />
                  <span>Nova página</span>
                </Link>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
          </>}
        </div>

        {/* Icon-only navigation */}

        <div
          className="
            hidden flex-col items-center gap-1 pt-3
            group-data-[collapsible=icon]:flex
          "
        >
          {showPageLayers ? (
            <button type="button" onClick={() => setPagesModeFor(editorPageId)} title="Voltar para páginas" aria-label="Voltar para páginas" className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent">
              <ArrowLeft className="size-[18px]" />
            </button>
          ) : rootPages.map((page) => {
            const href = `/admin/pages/${page.id}/edit`
            return (
              <Link
                key={page.id}
                href={href}
                title={page.title}
                aria-label={page.title}
                aria-current={pathname === href ? "page" : undefined}
                className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground aria-[current=page]:bg-sidebar-accent"
              >
                <FileText className="size-[18px]" />
              </Link>
            )
          })}

          {!showPageLayers && rootGroups.map((group) => {
            const href = `/admin/groups/${group.id}/edit`
            return (
              <Link
                key={group.id}
                href={href}
                title={group.title}
                aria-label={group.title}
                aria-current={pathname === href ? "page" : undefined}
                className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground aria-[current=page]:bg-sidebar-accent"
              >
                <Folder className="size-[18px]" />
              </Link>
            )
          })}
        </div>
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-sidebar-border/60 p-2">
        <div
          className="
            hidden
            px-1
            group-data-[collapsible=icon]:hidden
          "
        >
          <div className="flex items-center gap-0.5">
            <ActionLink href="/admin/menu" label="Menu">
              <Menu className="size-4" />
            </ActionLink>

            <ActionLink
              href="/admin/account"
              label="Configurações"
            >
              <Settings className="size-4" />
            </ActionLink>
          </div>

          <ActionLink href="/" label="Visitar site">
            <ExternalLink className="size-4" />
          </ActionLink>
        </div>

        <div className="grid gap-1 group-data-[collapsible=icon]:hidden">
          <Link href="/admin/menu" className="flex h-8 items-center gap-2 rounded-md px-2 text-xs text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Menu className="size-4" /> Menu
          </Link>
          <Link href="/admin/settings" className="flex h-8 items-center gap-2 rounded-md px-2 text-xs text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Settings className="size-4" /> Configurações
          </Link>
          <Link href="/admin/socials" className="flex h-8 items-center gap-2 rounded-md px-2 text-xs text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Share2 className="size-4" /> Redes sociais
          </Link>
          <Link href="/" className="flex h-8 items-center gap-2 rounded-md px-2 text-xs text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <ExternalLink className="size-4" /> Visitar site
          </Link>
          <ThemeToggle showLabel />
        </div>

        <div className="hidden justify-center group-data-[collapsible=icon]:flex">
          <ThemeToggle />
        </div>

        <Link
          href="/admin/account"
          title={user.email ?? user.id}
          className="
            group/user flex min-h-10 w-full
            min-w-0 items-center gap-2
            rounded-md px-1.5
            transition-colors
            hover:bg-sidebar-accent/80
            group-data-[collapsible=icon]:justify-center
            group-data-[collapsible=icon]:px-0
          "
        >
          <div
            className="
              flex size-7 shrink-0 items-center
              justify-center rounded-md
              border border-sidebar-border/70
              bg-sidebar-accent/60
              text-sidebar-foreground/75
            "
          >
            <UserRound className="size-4" strokeWidth={1.75} />
          </div>

          <div
            className="
              flex min-w-0 flex-1 flex-col
              gap-0.5
              group-data-[collapsible=icon]:hidden
            "
          >
            <span className="truncate text-xs font-medium text-sidebar-foreground">
              {user.email ?? user.id}
            </span>

            <span className="text-[10px] text-muted-foreground">
              Minha conta
            </span>
          </div>

          <Settings
            className="
              size-3.5 shrink-0 text-muted-foreground
              opacity-0 transition-opacity
              group-hover/user:opacity-100
              group-data-[collapsible=icon]:hidden
            "
          />
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
