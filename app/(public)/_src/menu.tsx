import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import type { MenuDropdown, MenuEntry } from "@/lib/menu"

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//")
}

function NavigationDropdown({ item }: { item: MenuDropdown }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="w-96 p-1">
          {item.items.map((dropdownItem) => (
            <li key={dropdownItem.id}>
              <NavigationMenuLink
                render={
                  <Link href={dropdownItem.href} prefetch={isInternalHref(dropdownItem.href)}>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="font-medium leading-none">
                        {dropdownItem.label}
                      </div>
                      {dropdownItem.description ? (
                        <div className="line-clamp-2 text-muted-foreground">
                          {dropdownItem.description}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                }
              />
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export function Menu({ items }: { items: MenuEntry[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) =>
          item.type === "dropdown" ? (
            <NavigationDropdown key={item.id} item={item} />
          ) : (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href={item.href} prefetch={isInternalHref(item.href)}>{item.label}</Link>}
              />
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
