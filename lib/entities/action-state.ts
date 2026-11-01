import {
  EntityConflictError,
  EntityNotFoundError,
  EntityUnauthorizedError,
  EntityValidationError,
} from "@/lib/entities/errors"

export type MutationState = {
  error?: string
}

export const INITIAL_MUTATION_STATE: MutationState = {}

export function getMutationError(error: unknown, fallback: string) {
  if (
    error instanceof EntityValidationError ||
    error instanceof EntityConflictError ||
    error instanceof EntityNotFoundError ||
    error instanceof EntityUnauthorizedError
  ) {
    return error.message
  }

  return fallback
}
