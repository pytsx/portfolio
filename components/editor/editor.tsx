"use client"

import dynamic from "next/dynamic"

import type { EditorProps } from "./editor-types"

const EditorClient = dynamic(
  () => import("./editor-client").then((module) => module.EditorClient),
  {
    ssr: false,
    loading: () => <div className="min-h-40 animate-pulse" aria-label="Carregando editor" role="status" />,
  },
)

export function Editor(props: EditorProps) {
  return <EditorClient {...props} />
}
