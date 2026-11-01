import "server-only"

import { EntityValidationError } from "@/lib/entities/errors"
import { requireSafeHref } from "@/lib/entities/url"
import { createAuthenticatedRepository } from "@/lib/firebase/authenticated-repository"
import { socialFromDocument, type SocialLink, type SocialLinkInput } from "@/lib/socials"

function validateSocialLink(input: SocialLinkInput): SocialLinkInput {
  const name = input.name.trim()
  if (!name) throw new EntityValidationError("Informe o nome da rede social.")
  const href = requireSafeHref(input.href, "URL")

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
