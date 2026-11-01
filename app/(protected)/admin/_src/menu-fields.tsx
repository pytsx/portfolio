"use client"

import { useState } from "react"
import { ChevronDown, Link2, Plus, Trash2 } from "lucide-react"

import { AdminField } from "./field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Menu, MenuDropdownLink, MenuEntry } from "@/lib/menu"

function createId() {
  return crypto.randomUUID()
}

function createLink(): MenuEntry {
  return { id: createId(), type: "link", label: "", href: "/" }
}

function createDropdownLink(): MenuDropdownLink {
  return { id: createId(), label: "", href: "/", description: "" }
}

function createDropdown(): MenuEntry {
  return {
    id: createId(),
    type: "dropdown",
    label: "",
    items: [createDropdownLink()],
  }
}

export function MenuFields({ menu }: { menu?: Menu }) {
  const [items, setItems] = useState<MenuEntry[]>(menu?.items ?? [])

  function replaceItem(updatedItem: MenuEntry) {
    setItems((currentItems) =>
      currentItems.map((item) => item.id === updatedItem.id ? updatedItem : item),
    )
  }

  function removeItem(id: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  return (
    <>
      <AdminField label="Nome do menu" htmlFor="name">
        <Input id="name" name="name" defaultValue={menu?.name} minLength={2} required />
      </AdminField>

      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-medium">Itens do menu</h3>
            <p className="text-xs text-muted-foreground">
              Adicione links simples ou menus dropdown.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setItems((value) => [...value, createLink()])}>
              <Link2 /> Link
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setItems((value) => [...value, createDropdown()])}>
              <ChevronDown /> Dropdown
            </Button>
          </div>
        </div>

        {items.map((item, itemIndex) => (
          <Card key={item.id} className="shadow-none">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>
                {itemIndex + 1}. {item.type === "link" ? "Link" : "Dropdown"}
              </CardTitle>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Remover item" onClick={() => removeItem(item.id)}>
                <Trash2 />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminField label="Título" htmlFor={`item-${item.id}-label`}>
                <Input
                  id={`item-${item.id}-label`}
                  value={item.label}
                  onChange={(event) => replaceItem({ ...item, label: event.target.value })}
                  required
                />
              </AdminField>

              {item.type === "link" ? (
                <AdminField label="Endereço" htmlFor={`item-${item.id}-href`}>
                  <Input
                    id={`item-${item.id}-href`}
                    value={item.href}
                    onChange={(event) => replaceItem({ ...item, href: event.target.value })}
                    required
                  />
                </AdminField>
              ) : (
                <div className="space-y-4 rounded-3xl bg-muted/40 p-4">
                  {item.items.map((dropdownItem, dropdownIndex) => (
                    <div key={dropdownItem.id} className="space-y-3 border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Subitem {dropdownIndex + 1}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Remover subitem"
                          onClick={() => replaceItem({
                            ...item,
                            items: item.items.filter((entry) => entry.id !== dropdownItem.id),
                          })}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <Input
                        aria-label="Título do subitem"
                        placeholder="Título"
                        value={dropdownItem.label}
                        onChange={(event) => replaceItem({
                          ...item,
                          items: item.items.map((entry) => entry.id === dropdownItem.id
                            ? { ...entry, label: event.target.value }
                            : entry),
                        })}
                        required
                      />
                      <Input
                        aria-label="Endereço do subitem"
                        placeholder="/rota"
                        value={dropdownItem.href}
                        onChange={(event) => replaceItem({
                          ...item,
                          items: item.items.map((entry) => entry.id === dropdownItem.id
                            ? { ...entry, href: event.target.value }
                            : entry),
                        })}
                        required
                      />
                      <Textarea
                        aria-label="Descrição do subitem"
                        placeholder="Descrição opcional"
                        value={dropdownItem.description}
                        onChange={(event) => replaceItem({
                          ...item,
                          items: item.items.map((entry) => entry.id === dropdownItem.id
                            ? { ...entry, description: event.target.value }
                            : entry),
                        })}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => replaceItem({
                      ...item,
                      items: [...item.items, createDropdownLink()],
                    })}
                  >
                    <Plus /> Adicionar subitem
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <label className="flex items-center gap-3 text-sm font-medium">
        <input type="checkbox" name="enabled" defaultChecked={menu?.enabled ?? true} />
        Exibir este menu
      </label>
    </>
  )
}
