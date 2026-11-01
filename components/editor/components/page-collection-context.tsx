"use client"

import { createContext, useContext, type PropsWithChildren } from "react"

import type { EditorCollectionData } from "../editor-types"

const EMPTY_COLLECTION_DATA: EditorCollectionData = { pages: [], groups: [] }

const PageCollectionContext = createContext<EditorCollectionData>(
  EMPTY_COLLECTION_DATA,
)

export function PageCollectionProvider({
  children,
  collections = EMPTY_COLLECTION_DATA,
}: PropsWithChildren<{ collections?: EditorCollectionData }>) {
  return (
    <PageCollectionContext.Provider value={collections}>
      {children}
    </PageCollectionContext.Provider>
  )
}

export function usePageCollections() {
  return useContext(PageCollectionContext)
}
