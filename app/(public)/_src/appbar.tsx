type AppbarProps = {
  children: React.ReactNode;
  
}

import { ThemeToggle } from "@/components/theme-toggle"
import { AccountMenu } from "./account-menu-server"

export function Appbar(props: AppbarProps) {
  const { children } = props;

  return (
    <div className="sticky top-0 z-50 flex items-center space-x-4 border-b border-border bg-background px-4 py-2">
      <div className="flex flex-1 items-center gap-2">
      {children}
      </div>
      <ThemeToggle />
      <AccountMenu />
    </div>
  )
}
