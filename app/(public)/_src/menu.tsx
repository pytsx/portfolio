import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link";

type NavigationDropdownItemProps = {
  title: string;
  items: {
    href: string;
    title: string;
    description: string;
  }[]
};

function NavigationDropdownItem({ title, items }: NavigationDropdownItemProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="w-96">
          {items.map((item) => (
            <li key={item.title}>
              <NavigationMenuLink render={<Link href={item.href}><div className="flex flex-col gap-1 text-sm">
                <div className="leading-none font-medium">{title}</div>
                <div className="line-clamp-2 text-muted-foreground">{item.description}</div>
              </div></Link>} />
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

type MenuProps = {
  items: ({
    title: string;
    href: string;
  } | NavigationDropdownItemProps)[]
}

export function Menu({  items }: MenuProps) {
  return (
    <NavigationMenu>
        <NavigationMenuList>

          {
            items.map((item, index) => {
              if ('items' in item) {
                return (
                  <NavigationDropdownItem key={index} title={item.title} items={item.items} />
                )
              }
              return (
                <NavigationMenuItem key={index} >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href={item.href}>{item.title}</Link>} />
                </NavigationMenuItem>
              )
            })
          }
        </NavigationMenuList>
      </NavigationMenu>
  )
}

