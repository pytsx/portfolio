import "server-only"

import { EntityValidationError } from "@/lib/entities/errors"
import { createAuthenticatedRepository } from "@/lib/firebase/authenticated-repository"
import {
  MENU_COLLECTION,
  menuFromDocument,
  parseMenuEntries,
  type Menu,
  type MenuInput,
} from "@/lib/menu"

function validateMenu(input: MenuInput): MenuInput {
  const name = input.name.trim()

  if (name.length < 2) {
    throw new EntityValidationError("O nome precisa ter pelo menos 2 caracteres.")
  }

  return {
    name,
    enabled: input.enabled,
    items: parseMenuEntries(input.items),
  }
}

export const menuRepository = createAuthenticatedRepository<
  Menu,
  MenuInput,
  MenuInput
>({
  collectionName: MENU_COLLECTION,
  fromDocument: menuFromDocument,
  serializeCreate: (input) => validateMenu(input),
  serializeUpdate: validateMenu,
})
