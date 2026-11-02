import { getAuthenticatedUser } from "@/lib/auth/server"
import { connection } from "next/server"
import { AccountMenuClient } from "./account-menu"

export async function AccountMenu() {
  await connection()
  const user = await getAuthenticatedUser()
  return <AccountMenuClient user={user} />
}
