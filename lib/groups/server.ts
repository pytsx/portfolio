import "server-only"

import { createSlug } from "@/lib/entities/document"
import { EntityValidationError } from "@/lib/entities/errors"
import { createAuthenticatedRepository } from "@/lib/firebase/authenticated-repository"
import { groupFromDocument, type GroupInput, type PageGroup } from "@/lib/groups"

function validateGroup(input: GroupInput): GroupInput {
  const title = input.title.trim()
  const slug = createSlug(input.slug.trim() || title)

  if (!title || !slug) {
    throw new EntityValidationError("Informe um nome e um endereço válidos para o grupo.")
  }

  return {
    title,
    slug,
    content: input.content,
    ...(input.parentId?.trim() ? { parentId: input.parentId.trim() } : {}),
  }
}

const baseGroupRepository = createAuthenticatedRepository<
  PageGroup,
  GroupInput,
  GroupInput
>({
  collectionName: "groups",
  fromDocument: groupFromDocument,
  serializeCreate: (input) => validateGroup(input),
  serializeUpdate: validateGroup,
})

export const groupRepository = {
  ...baseGroupRepository,
  async update(id: string, input: GroupInput) {
    const group = await baseGroupRepository.get(id)
    return baseGroupRepository.update(id, {
      ...input,
      slug: group?.slug ?? input.slug,
    })
  },
}
