import { Input } from "@/components/ui/input"
import type { SocialLink } from "@/lib/socials"
import { AdminField } from "@/app/(protected)/admin/_src/field"

export function SocialFields({ social }: { social?: SocialLink }) {
  return (
    <>
      <AdminField label="Nome" htmlFor="name">
        <Input id="name" name="name" defaultValue={social?.name} required />
      </AdminField>
      <AdminField label="URL" htmlFor="href">
        <Input id="href" name="href" type="url" defaultValue={social?.href} required />
      </AdminField>
      <label className="flex items-center gap-2 text-sm">
        <input name="visible" type="checkbox" defaultChecked={social?.visible ?? true} />
        Exibir no footer público
      </label>
    </>
  )
}
