
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { ComponentProps } from "react"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import {
  Ban,
  BookOpen,
  ExternalLink,
  GripVertical,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react"

import {
  DragDropProvider,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/react"
import {
  isSortable,
  useSortable,
} from "@dnd-kit/react/sortable"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type NavigationItem = {
  id: string
  title: string
  url: string
  icon: LucideIcon
}

export type NavigationGroup = {
  id: string
  label: string
  items: NavigationItem[]
}

export type AppSidebarProps = {
  navigation: NavigationGroup[]
  catalog: NavigationGroup[]
  onNavigationChange: (
    navigation: NavigationGroup[]
  ) => void
}

type DragEndEvent = Parameters<
  NonNullable<
    ComponentProps<typeof DragDropProvider>["onDragEnd"]
  >
>[0]

const TRASH_ID = "sidebar:trash"

const getItemType = (groupId: string) =>
  `sidebar:item:${groupId}`

// --------------------------------------------------
// SORTABLE ITEM
// --------------------------------------------------

function SortableNavigationItem({
  item,
  index,
  groupId,
  active,
}: {
  item: NavigationItem
  index: number
  groupId: string
  active: boolean
}) {
  const { state } = useSidebar()

  const {
    ref,
    handleRef,
    isDragging,
    isDropTarget,
  } = useSortable({
    id: item.id,
    index,
    group: groupId,

    type: getItemType(groupId),
    accept: getItemType(groupId),

    disabled: state === "collapsed",

    transition: {
      duration: 240,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  })

  const Icon = item.icon

  return (
    <SidebarMenuItem
      ref={ref}
      className={[
        "group/nav-item relative",
        "transition-opacity duration-200",
        isDragging ? "opacity-25" : "",
      ].join(" ")}
    >
      <SidebarMenuButton
        render={<Link href={item.url} />}
        tooltip={item.title}
        isActive={active}
        className={[
          "glass-nav-item",
          "h-10 gap-3 rounded-xl px-3 pr-9",
          "transition-[background-color,box-shadow,color]",
          "duration-200",
          "group-data-[collapsible=icon]:!size-8",
          "group-data-[collapsible=icon]:!p-2",
          isDropTarget ? "glass-nav-target" : "",
        ].join(" ")}
      >
        <Icon className="size-4 shrink-0" />

        <span className="min-w-0 flex-1 truncate text-[13px] group-data-[collapsible=icon]:hidden">
          {item.title}
        </span>
      </SidebarMenuButton>

      <button
        ref={handleRef}
        type="button"
        aria-label={`Reordenar ${item.title}`}
        title={`Arrastar ${item.title}`}
        className={[
          "absolute right-1.5 top-1/2 z-10",
          "flex size-7 -translate-y-1/2",
          "items-center justify-center rounded-lg",
          "cursor-grab touch-none active:cursor-grabbing",
          "text-muted-foreground/60",
          "opacity-0 transition-all duration-200",
          "hover:bg-black/5 dark:hover:bg-white/10",
          "hover:text-foreground",
          "group-hover/nav-item:opacity-100",
          "group-focus-within/nav-item:opacity-100",
          "focus-visible:opacity-100",
          "focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring",
          "max-sm:opacity-100",
          "group-data-[collapsible=icon]:hidden",
        ].join(" ")}
      >
        <GripVertical className="size-4" />
      </button>
    </SidebarMenuItem>
  )
}

// --------------------------------------------------
// NAVIGATION SECTION
// --------------------------------------------------

function NavigationSection({
  group,
  availableItems,
  pathname,
  draggingGroupId,
  onAddItem,
}: {
  group: NavigationGroup
  availableItems: NavigationItem[]
  pathname: string
  draggingGroupId: string | null
  onAddItem: (groupId: string, itemId: string) => void
}) {
  const locked =
    draggingGroupId !== null &&
    draggingGroupId !== group.id

  return (
    <SidebarGroup
      data-sidebar-nav-group={group.id}
      className={[
        "px-1 py-2",
        "group-data-[collapsible=icon]:px-0",
        "transition-[opacity,filter] duration-200",
        locked ? "opacity-35 saturate-50" : "",
      ].join(" ")}
    >
      {/* GROUP HEADING + ADD BUTTON */}
      <div className="mb-2 flex h-8 items-center justify-between px-2 group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="h-auto p-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/75">
          {group.label}
        </SidebarGroupLabel>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                disabled={draggingGroupId !== null}
                aria-label={`Adicionar item em ${group.label}`}
                title={`Adicionar em ${group.label}`}
                className={[
                  "glass-add-button",
                  "flex size-7 items-center justify-center",
                  "rounded-full",
                  "transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:pointer-events-none",
                  "disabled:opacity-40",
                ].join(" ")}
              />
            }
          >
            <Plus className="size-3.5" />
          </DropdownMenuTrigger>


          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={12}
            className="glass-sidebar-dropdown w-60 rounded-2xl p-2"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2 text-[11px] font-medium text-muted-foreground">
                Adicionar em {group.label}
              </DropdownMenuLabel>

              {availableItems.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                  Todos os itens já estão no grupo.
                </div>
              ) : (
                availableItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onSelect={() => onAddItem(group.id, item.id)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors focus:bg-white/50 dark:focus:bg-white/10"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10">
                        <Icon className="size-4" />
                      </div>

                      <span className="min-w-0 flex-1 truncate">
                        {item.title}
                      </span>

                      <Plus className="size-3.5 text-muted-foreground" />
                    </DropdownMenuItem>
                  )
                })
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>

        </DropdownMenu>
      </div>

      {/* GROUP CONTENT */}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {group.items.map((item, index) => {
            const active =
              pathname === item.url ||
              (item.url !== "/admin" &&
                pathname.startsWith(`${item.url}/`))

            return (
              <SortableNavigationItem
                key={item.id}
                item={item}
                index={index}
                groupId={group.id}
                active={active}
              />
            )
          })}
        </SidebarMenu>

        {group.items.length === 0 && (
          <div className="px-2 py-3 text-center text-[11px] text-muted-foreground/70 group-data-[collapsible=icon]:hidden">
            Nenhum item neste grupo
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

// --------------------------------------------------
// FLOATING GLASS TRASH
// --------------------------------------------------

function FloatingTrash({
  visible,
  acceptedTypes,
}: {
  visible: boolean
  acceptedTypes: string[]
}) {
  const { ref, isDropTarget } = useDroppable({
    id: TRASH_ID,
    accept: acceptedTypes,
    disabled: !visible,
    collisionPriority: 100,
  })

  return (
    <div
      ref={ref}
      title="Solte para remover o atalho"
      aria-label="Solte para remover o atalho"
      className={[
        "glass-trash",
        "absolute -top-20 left-1/2 z-50",
        "flex size-14 -translate-x-1/2",
        "items-center justify-center",
        "rounded-[20px]",
        "transition-[opacity,scale,background-color,box-shadow,border-color]",
        "duration-200 ease-out",
        "group-data-[collapsible=icon]:size-10",
        !visible
          ? "pointer-events-none scale-75 opacity-0"
          : "pointer-events-auto scale-100 opacity-100",
        isDropTarget
          ? "glass-trash-active scale-110"
          : "",
      ].join(" ")}
    >
      <Trash2
        className={[
          "size-5 transition-transform duration-200",
          "group-data-[collapsible=icon]:size-4",
          isDropTarget
            ? "scale-110 text-red-500"
            : "text-muted-foreground",
        ].join(" ")}
      />
    </div>
  )
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export function AppSidebar({
  navigation,
  catalog,
  onNavigationChange,
}: AppSidebarProps) {
  const pathname = usePathname()

  const [draggingId, setDraggingId] =
    useState<string | null>(null)

  const [draggingGroupId, setDraggingGroupId] =
    useState<string | null>(null)

  const [hoveredGroupId, setHoveredGroupId] =
    useState<string | null>(null)

  const isDragging = draggingId !== null

  const invalidGroup =
    draggingGroupId !== null &&
    hoveredGroupId !== null &&
    draggingGroupId !== hoveredGroupId

  const acceptedTypes = navigation.map((group) =>
    getItemType(group.id)
  )

  // Identifica o grupo sob o ponteiro mesmo
  // quando ele não é um destino válido do dnd-kit.
  useEffect(() => {
    if (!isDragging) return

    function handlePointerMove(event: PointerEvent) {
      const element = document.elementFromPoint(
        event.clientX,
        event.clientY
      )

      const groupElement = element?.closest<HTMLElement>(
        "[data-sidebar-nav-group]"
      )

      setHoveredGroupId(
        groupElement?.dataset.sidebarNavGroup ?? null
      )
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    )

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      )
    }
  }, [isDragging])

  function resetDrag() {
    setDraggingId(null)
    setDraggingGroupId(null)
    setHoveredGroupId(null)
  }

  // ------------------------------------------------
  // ADD ITEM
  // ------------------------------------------------

  function addItem(groupId: string, itemId: string) {
    // O catálogo define a qual grupo o item pertence.
    const catalogGroup = catalog.find(
      (group) => group.id === groupId
    )

    const item = catalogGroup?.items.find(
      (item) => item.id === itemId
    )

    if (!item) return

    // Não permite IDs duplicados em nenhum grupo.
    const alreadyExists = navigation.some((group) =>
      group.items.some((entry) => entry.id === itemId)
    )

    if (alreadyExists) return

    // Somente grupos existentes podem receber itens.
    if (!navigation.some((group) => group.id === groupId)) {
      return
    }

    onNavigationChange(
      navigation.map((group) =>
        group.id === groupId
          ? {
            ...group,
            items: [...group.items, item],
          }
          : group
      )
    )
  }

  // ------------------------------------------------
  // DRAG END
  // ------------------------------------------------

  function handleDragEnd(event: DragEndEvent) {
    resetDrag()

    if (event.canceled) return

    const { source, target } = event.operation

    if (!isSortable(source)) return

    const itemId = String(source.id)

    const originGroup = navigation.find((group) =>
      group.items.some((item) => item.id === itemId)
    )

    if (!originGroup) return

    if (source.initialGroup !== originGroup.id) {
      return
    }

    // DROP INTO TRASH
    if (target?.id === TRASH_ID) {
      onNavigationChange(
        navigation.map((group) =>
          group.id === originGroup.id
            ? {
              ...group,
              items: group.items.filter(
                (item) => item.id !== itemId
              ),
            }
            : group
        )
      )

      return
    }

    // BLOCK CROSS-GROUP MOVEMENTS
    if (!target || !isSortable(target)) return

    if (
      source.group !== originGroup.id ||
      target.group !== originGroup.id
    ) {
      return
    }

    // SORT WITHIN THE ORIGINAL GROUP
    const oldIndex = originGroup.items.findIndex(
      (item) => item.id === itemId
    )

    const newIndex = source.index

    if (
      oldIndex < 0 ||
      newIndex < 0 ||
      newIndex >= originGroup.items.length ||
      oldIndex === newIndex
    ) {
      return
    }

    onNavigationChange(
      navigation.map((group) => {
        if (group.id !== originGroup.id) return group

        const items = [...group.items]

        const [moved] = items.splice(oldIndex, 1)
        items.splice(newIndex, 0, moved)

        return {
          ...group,
          items,
        }
      })
    )
  }

  return (
    <DragDropProvider
      onDragStart={({ operation }) => {
        const source = operation.source

        if (!isSortable(source)) return

        const id = String(source.id)

        const group = navigation.find((group) =>
          group.items.some((item) => item.id === id)
        )

        if (!group) return

        setDraggingId(id)
        setDraggingGroupId(group.id)
        setHoveredGroupId(null)
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation

        if (
          isSortable(source) &&
          isSortable(target) &&
          target.group !== source.initialGroup
        ) {
          event.preventDefault()
        }
      }}
      onDragEnd={handleDragEnd}
    >
      <Sidebar
        variant="floating"
        collapsible="icon"
        className="glass-sidebar"
      >
        {/* HEADER */}
        <SidebarHeader className="gap-3 border-b border-white/30 p-3 dark:border-white/10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/admin" />}
                size="lg"
                tooltip="Meu Blog"
                className="h-12 gap-3 rounded-xl group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-0"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-sm group-data-[collapsible=icon]:size-8">
                  <BookOpen className="size-4" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-start text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-semibold tracking-tight">
                    Meu Blog
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    Painel administrativo
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/admin/posts/new" />}
                tooltip="Nova publicação"
                className="h-10 justify-center gap-2 rounded-xl bg-foreground font-medium text-background shadow-sm transition-all hover:scale-[1.02] hover:bg-foreground/90 hover:text-background active:scale-[0.98] group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-0"
              >
                <Plus className="size-4 shrink-0" />
                <span className="text-[13px] group-data-[collapsible=icon]:hidden">
                  Nova publicação
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent className="gap-1 px-2 py-3">
          {navigation.map((group) => {
            const originalGroup = catalog.find(
              (entry) => entry.id === group.id
            )

            const availableItems =
              originalGroup?.items.filter(
                (item) =>
                  !navigation.some((section) =>
                    section.items.some(
                      (entry) => entry.id === item.id
                    )
                  )
              ) ?? []

            return (
              <NavigationSection
                key={group.id}
                group={group}
                availableItems={availableItems}
                pathname={pathname}
                draggingGroupId={draggingGroupId}
                onAddItem={addItem}
              />
            )
          })}
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter className="relative gap-2 border-t border-white/30 p-3 dark:border-white/10">
          <FloatingTrash
            visible={isDragging}
            acceptedTypes={acceptedTypes}
          />

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                tooltip="Visualizar blog"
                className="glass-nav-item h-10 gap-3 rounded-xl px-3 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2"
              >
                <ExternalLink className="size-4 shrink-0" />
                <span className="truncate text-[13px] group-data-[collapsible=icon]:hidden">
                  Visualizar blog
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/admin/profile" />}
                size="lg"
                tooltip="Minha conta"
                className="glass-nav-item h-12 gap-3 rounded-xl group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-0"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 group-data-[collapsible=icon]:size-8">
                  <UserRound className="size-4 text-muted-foreground" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-[13px] font-medium">
                    Administrador
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    Minha conta
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* FLOATING DRAG PREVIEW */}
      <DragOverlay
        className="pointer-events-none z-[100]"
        dropAnimation={{
          duration: 180,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {(source) => {
          const item = navigation
            .flatMap((group) => group.items)
            .find((item) => item.id === source.id)

          if (!item) return null

          const Icon = item.icon

          return (
            <div
              className={[
                "glass-drag-preview",
                "flex h-11 w-56 items-center gap-3",
                "rounded-2xl px-3",
                "transition-[box-shadow,opacity,background-color]",
                "duration-150",
                invalidGroup
                  ? "glass-drag-invalid"
                  : "",
              ].join(" ")}
            >
              <Icon className="size-4 shrink-0" />

              <span className="flex-1 truncate text-[13px] font-medium">
                {item.title}
              </span>

              {invalidGroup ? (
                <Ban className="size-4 text-red-500" />
              ) : (
                <GripVertical className="size-4 text-muted-foreground" />
              )}
            </div>
          )
        }}
      </DragOverlay>
    </DragDropProvider>
  )
}
