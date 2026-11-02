import "server-only"

import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  type DocumentData,
  type Firestore,
} from "firebase/firestore"

import { getAuthenticatedContext } from "@/lib/auth/server"
import {
  EntityConflictError,
  EntityNotFoundError,
  EntityUnauthorizedError,
} from "@/lib/entities/errors"
import type { EntityRepository } from "@/lib/entities/repository"

type RepositoryConfiguration<Entity, CreateInput, UpdateInput> = {
  collectionName: string
  fromDocument(id: string, data: DocumentData): Entity
  getDocumentId?(input: CreateInput): string
  serializeCreate(input: CreateInput, userId: string): DocumentData
  serializeUpdate(input: UpdateInput): DocumentData
}

async function requireDatabase(): Promise<{ db: Firestore; userId: string }> {
  const context = await getAuthenticatedContext()

  if (!context) {
    throw new EntityUnauthorizedError("Sua sessão expirou. Entre novamente.")
  }

  return { db: context.db, userId: context.user.id }
}

function requireDocumentId(id: string) {
  const normalizedId = id.trim()
  if (!normalizedId || normalizedId.length > 256 || normalizedId.includes("/")) {
    throw new EntityNotFoundError("Identificador do registro não informado.")
  }

  return normalizedId
}

export function createAuthenticatedRepository<Entity, CreateInput, UpdateInput>(
  configuration: RepositoryConfiguration<Entity, CreateInput, UpdateInput>,
): EntityRepository<Entity, CreateInput, UpdateInput> {
  const { collectionName, fromDocument, getDocumentId } = configuration

  return {
    async list() {
      const { db } = await requireDatabase()
      const snapshot = await getDocs(collection(db, collectionName))
      return snapshot.docs.map((document) =>
        fromDocument(document.id, document.data()),
      )
    },
    async get(id) {
      const { db } = await requireDatabase()
      const snapshot = await getDoc(
        doc(db, collectionName, requireDocumentId(id)),
      )
      return snapshot.exists() ? fromDocument(snapshot.id, snapshot.data()) : null
    },
    async create(input) {
      const { db, userId } = await requireDatabase()
      const collectionReference = collection(db, collectionName)
      const reference = getDocumentId
        ? doc(collectionReference, getDocumentId(input))
        : doc(collectionReference)
      const data = {
        ...configuration.serializeCreate(input, userId),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await runTransaction(db, async (transaction) => {
        if ((await transaction.get(reference)).exists()) {
          throw new EntityConflictError("Já existe um registro com este identificador.")
        }

        transaction.set(reference, data)
      })
      return fromDocument(reference.id, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    },
    async update(id, input) {
      const { db } = await requireDatabase()
      const reference = doc(db, collectionName, requireDocumentId(id))
      const data = {
        ...configuration.serializeUpdate(input),
        updatedAt: serverTimestamp(),
      }

      const existingData = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(reference)

        if (!snapshot.exists()) {
          throw new EntityNotFoundError("Registro não encontrado.")
        }

        transaction.update(reference, data)
        return snapshot.data()
      })

      return fromDocument(reference.id, {
        ...existingData,
        ...data,
        updatedAt: new Date(),
      })
    },
    async delete(id) {
      const { db } = await requireDatabase()
      const reference = doc(db, collectionName, requireDocumentId(id))

      await runTransaction(db, async (transaction) => {
        if (!(await transaction.get(reference)).exists()) {
          throw new EntityNotFoundError("Registro não encontrado.")
        }

        transaction.delete(reference)
      })
    },
  }
}
