import "server-only"

import { collection, doc, getDocs, query, where, writeBatch } from "firebase/firestore"

import { getAuthenticatedContext } from "@/lib/auth/server"

export async function clearOtherHomeDocuments(
  currentCollection: "groups" | "pages",
  currentId: string,
) {
  const context = await getAuthenticatedContext()
  if (!context) return

  const [groups, pages] = await Promise.all([
    getDocs(query(collection(context.db, "groups"), where("isHome", "==", true))),
    getDocs(query(collection(context.db, "pages"), where("isHome", "==", true))),
  ])
  const batch = writeBatch(context.db)

  for (const [collectionName, snapshot] of [
    ["groups", groups],
    ["pages", pages],
  ] as const) {
    snapshot.docs
      .filter((document) => !(currentCollection === collectionName && document.id === currentId))
      .forEach((document) => {
        batch.update(document.ref, { isHome: false })

        const publicIndex = collectionName === "groups"
          ? "public-group-index"
          : "public-page-index"
        const indexReference = doc(context.db, publicIndex, document.id)
        if (document.data().visibility === "private") {
          batch.delete(indexReference)
        } else {
          batch.set(indexReference, { isHome: false }, { merge: true })
        }
      })
  }

  await batch.commit()
}
