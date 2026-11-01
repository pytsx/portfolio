import {
  BlockNoteSchema,
  createCodeBlockSpec,
  defaultBlockSpecs,
} from "@blocknote/core"
import { codeBlockOptions } from "@blocknote/code-block"

import { calloutBlock } from "./blocks/callout-block"
import { youtubeBlock } from "./blocks/youtube-block"
import { pageCollectionBlock } from "./blocks/page-collection-block"

export const editorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    codeBlock: createCodeBlockSpec(codeBlockOptions),
    callout: calloutBlock,
    youtube: youtubeBlock,
    pageCollection: pageCollectionBlock,
  },
})
