import "server-only"

import { EntityValidationError } from "@/lib/entities/errors"
import { createAuthenticatedRepository } from "@/lib/firebase/authenticated-repository"
import { socialFromDocument, type SocialLink, type SocialLinkInput } from "@/lib/socials"

function validateSocialLink(input: SocialLinkInput): SocialLinkInput {
  const name = input.name.trim()
  const href = input.href.trim()

  if (!name) throw new EntityValidationError("Informe o nome da rede social.")

  try {
    new URL(href)
  } catch {
    throw new EntityValidationError("Informe uma URL válida.")
  }

  return { name, href, visible: input.visible }
}

export const socialRepository = createAuthenticatedRepository<
  SocialLink,
  SocialLinkInput,
  SocialLinkInput
>({
  collectionName: "socials",
  fromDocument: socialFromDocument,
  serializeCreate: (input) => validateSocialLink(input),
  serializeUpdate: validateSocialLink,
})
