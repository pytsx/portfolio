"use client"

import type { ComponentProps, ComponentType, PointerEvent as ReactPointerEvent, ReactElement } from "react"
import { Ban, GripVertical, Plus, Trash2 } from "lucide-react"
import {
  DragDropProvider,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/react"
import { isSortable, useSortable } from "@dnd-kit/react/sortable"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

/** UI contract: no blog-specific routes, permissions, or internal application state. */
export type SidebarNavigationItem = {
  id: string
  title: string
  url: string
  icon?: ComponentType<{ className?: string }>
}

export type SidebarNavigationGroup = {
  id: string
  label: string
  items: SidebarNavigationItem[]
}

export type SidebarDragState = {
  itemId: string | null
  groupId: string | null
  hoveredGroupId: string | null
}

export type SidebarNavigationProps = {
  navigation: SidebarNavigationGroup[]
  catalog: SidebarNavigationGroup[]
  activeItemId?: string
  renderLink?: (item: SidebarNavigationItem) => ReactElement
  openMenuGroupId: string | null
  onOpenMenuGroupChange: (id: string | null) => void
  drag: SidebarDragState
  onDragStart: (itemId: string, groupId: string) => void
  onDragEnd: () => void
  onHoverGroupChange: (groupId: string | null) => void
  onAddItem: (groupId: string, itemId: string) => void
  onRemoveItem: (groupId: string, itemId: string) => void
  onReorderItem: (groupId: string, itemId: string, toIndex: number) => void
  className?: string
}

type DragEndEvent = Parameters<
  NonNullable<ComponentProps<typeof DragDropProvider>["onDragEnd"]>
>[0]

const TRASH_ID = "__sidebar_trash__"
const itemType = (groupId: string) => `sidebar-item:${groupId}`

function SortableItem({
  item,
  groupId,
  index,
  active,
  renderLink,
}: {
  item: SidebarNavigationItem
  groupId: string
  index: number
  active: boolean
  renderLink?: SidebarNavigationProps["renderLink"]
}) {
  const { state, isMobile } = useSidebar()
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id: item.id,
    index,
    group: groupId,
    type: itemType(groupId),
    accept: itemType(groupId),
    disabled: !isMobile && state === "collapsed",
    transition: {
      duration: 220,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  })

  const Icon = item.icon

  return (
    <SidebarMenuItem
      ref={ref}
      className={isDragging ? "opacity-25" : "transition-opacity duration-200"}
    >
      <SidebarMenuButton
        render={renderLink?.(item) ?? <a href={item.url} />}
        isActive={active}
        tooltip={item.title}
        className={[
          "glass-sidebar-item h-10 gap-3 pr-9 text-[13px]",
          "group-data-[collapsible=icon]:pr-2",
          isDropTarget ? "ring-1 ring-sidebar-ring/25" : "",
        ].join(" ")}
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden">
          {item.title}
        </span>
      </SidebarMenuButton>

      <SidebarMenuAction
        ref={handleRef}
        type="button"
        showOnHover
        title={`Arrastar ${item.title}`}
        aria-label={`Reordenar ${item.title}`}
        className="top-2.5! right-2! size-5! cursor-grab touch-none rounded-md text-muted-foreground/70 active:cursor-grabbing max-sm:opacity-100"
      >
        <GripVertical className="size-4" />
      </SidebarMenuAction>
    </SidebarMenuItem>
  )
}

function NavigationGroup({
  group,
  catalogGroup,
  props,
}: {
  group: SidebarNavigationGroup
  catalogGroup?: SidebarNavigationGroup
  props: SidebarNavigationProps
}) {
  const forbidden =
    props.drag.groupId !== null && props.drag.groupId !== group.id

  const allVisibleIds = new Set(
    props.navigation.flatMap((section) => section.items.map((item) => item.id))
  )
  const available =
    catalogGroup?.items.filter((item) => !allVisibleIds.has(item.id)) ?? []

  return (
    <SidebarGroup
      data-navigation-group-id={group.id}
      className={[
        "px-1 py-2 transition-[opacity,filter] duration-200",
        "group-data-[collapsible=icon]:px-0",
        forbidden ? "opacity-35 saturate-50" : "",
      ].join(" ")}
    >
      <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[.14em]">
        {group.label}
      </SidebarGroupLabel>

      <DropdownMenu
        open={props.openMenuGroupId === group.id}
        onOpenChange={(open) => props.onOpenMenuGroupChange(open ? group.id : null)}
      >
        <DropdownMenuTrigger
          render={
            <SidebarGroupAction
              type="button"
              disabled={props.drag.itemId !== null}
              aria-label={`Adicionar item em ${group.label}`}
              className="glass-sidebar-plus size-6! rounded-full"
            />
          }
        >
          <Plus className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="right"
          sideOffset={12}
          className="glass-sidebar-dropdown w-60 rounded-2xl p-2"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Adicionar em {group.label}</DropdownMenuLabel>
            {available.length === 0 ? (
              <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                Nenhum item disponível
              </div>
            ) : (
              available.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem
                    key={item.id}
                    onSelect={() => props.onAddItem(group.id, item.id)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2.5"
                  >
                    {Icon ? <Icon className="size-4 shrink-0" /> : null}
                    <span className="flex-1 truncate">{item.title}</span>
                    <Plus className="size-3.5 text-muted-foreground" />
                  </DropdownMenuItem>
                )
              })
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {group.items.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              groupId={group.id}
              index={index}
              active={props.activeItemId === item.id}
              renderLink={props.renderLink}
            />
          ))}
        </SidebarMenu>
        {group.items.length === 0 ? (
          <p className="px-2 py-3 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            Grupo vazio. Use + para adicionar.
          </p>
        ) : null}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function TrashDropTarget({
  active,
  acceptedTypes,
}: {
  active: boolean
  acceptedTypes: string[]
}) {
  const { ref, isDropTarget } = useDroppable({
    id: TRASH_ID,
    accept: acceptedTypes,
    disabled: !active,
    collisionPriority: 100,
  })

  return (
    <div
      ref={ref}
      role="status"
      aria-label="Solte aqui para remover o atalho"
      title="Solte aqui para remover o atalho"
      className={[
        "glass-sidebar-trash absolute bottom-3 left-1/2 z-50",
        "flex size-14 -translate-x-1/2 items-center justify-center rounded-2xl",
        "transition-[opacity,scale,border-color,background-color,box-shadow] duration-200",
        !active ? "pointer-events-none scale-75 opacity-0" : "scale-100 opacity-100",
        isDropTarget ? "scale-110! border-red-400! bg-red-500/15! text-red-500!" : "",
      ].join(" ")}
    >
      <Trash2 className="size-5" />
    </div>
  )
}

/**
 * Controlled, route-agnostic navigation.
 * Place this component BETWEEN your own SidebarHeader and SidebarFooter.
 */
export function SidebarNavigation(props: SidebarNavigationProps) {
  const dragging = props.drag.itemId !== null
  const invalidTarget =
    props.drag.groupId !== null &&
    props.drag.hoveredGroupId !== null &&
    props.drag.groupId !== props.drag.hoveredGroupId

  function handleDragEnd(event: DragEndEvent) {
    // Reset the external transient state, regardless of drop outcome.
    props.onDragEnd()
    if (event.canceled) return

    const { source, target } = event.operation
    if (!isSortable(source)) return

    const itemId = String(source.id)
    const origin = props.navigation.find((group) =>
      group.items.some((item) => item.id === itemId)
    )
    if (!origin || String(source.initialGroup) !== origin.id) return

    // Trash is the only legal destination outside the original group.
    if (target?.id === TRASH_ID) {
      props.onRemoveItem(origin.id, itemId)
      return
    }

    if (!target || !isSortable(target)) return
    if (
      String(source.group) !== origin.id ||
      String(target.group) !== origin.id ||
      (props.drag.hoveredGroupId !== null &&
        props.drag.hoveredGroupId !== origin.id)
    ) {
      return
    }

    const index = Number(source.index)
    if (!Number.isInteger(index) || index < 0 || index >= origin.items.length) return
    props.onReorderItem(origin.id, itemId, index)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return
    const hovered = event.currentTarget.ownerDocument.elementFromPoint(
      event.clientX,
      event.clientY
    )
    const group = hovered?.closest<HTMLElement>("[data-navigation-group-id]")
    props.onHoverGroupChange(group?.dataset.navigationGroupId ?? null)
  }

  return (
    <DragDropProvider
      onDragStart={({ operation }) => {
        const source = operation.source
        if (!isSortable(source)) return
        const itemId = String(source.id)
        const group = props.navigation.find((entry) =>
          entry.items.some((item) => item.id === itemId)
        )
        if (group) props.onDragStart(itemId, group.id)
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation
        if (
          isSortable(source) &&
          isSortable(target) &&
          source.initialGroup !== target.group
        ) event.preventDefault()
      }}
      onDragEnd={handleDragEnd}
    >
      <div
        className={`relative flex min-h-0 flex-1 flex-col ${props.className ?? ""}`}
        onPointerMoveCapture={handlePointerMove}
        onPointerLeave={() => dragging && props.onHoverGroupChange(null)}
      >
        <SidebarContent className="gap-1 px-2 py-3">
          {props.navigation.map((group) => (
            <NavigationGroup
              key={group.id}
              group={group}
              catalogGroup={props.catalog.find((entry) => entry.id === group.id)}
              props={props}
            />
          ))}
        </SidebarContent>
        <TrashDropTarget
          active={dragging}
          acceptedTypes={props.navigation.map((group) => itemType(group.id))}
        />
      </div>

      <DragOverlay
        className="pointer-events-none z-[100]"
        dropAnimation={{ duration: 160, easing: "ease-out" }}
      >
        {(source) => {
          const item = props.navigation
            .flatMap((group) => group.items)
            .find((entry) => entry.id === source.id)
          if (!item) return null
          const Icon = item.icon
          return (
            <div className={[
              "glass-sidebar-overlay flex h-11 w-56 items-center gap-3 rounded-2xl px-3",
              invalidTarget ? "opacity-55 shadow-none!" : "",
            ].join(" ")}>
              {Icon ? <Icon className="size-4" /> : null}
              <span className="flex-1 truncate text-sm font-medium">{item.title}</span>
              {invalidTarget ? <Ban className="size-4 text-red-500" /> : <GripVertical className="size-4 opacity-60" />}
            </div>
          )
        }}
      </DragOverlay>
    </DragDropProvider>
  )
}
