import { getAuthenticatedUser } from "@/lib/auth/server"
import { AccountMenuClient } from "./account-menu"

export async function AccountMenu() {
  const user = await getAuthenticatedUser()
  return <AccountMenuClient user={user} />
}
