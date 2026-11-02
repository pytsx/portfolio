import {
  BlockNoteSchema,
  createCodeBlockSpec,
  defaultBlockSpecs,
} from "@blocknote/core"
import { codeBlockOptions } from "@blocknote/code-block"

import { calloutBlock } from "./blocks/callout-block"
import { youtubeBlock } from "./blocks/youtube-block"
import { pageCollectionBlock } from "./blocks/page-collection-block"
import { cardBlock, columnBlock, columnsBlock, sectionBlock, stackBlock } from "./blocks/layout-blocks"
import { buttonBlock } from "./blocks/button-block"

export const editorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    codeBlock: createCodeBlockSpec(codeBlockOptions),
    callout: calloutBlock,
    youtube: youtubeBlock,
    pageCollection: pageCollectionBlock,
    button: buttonBlock,
    section: sectionBlock,
    columns: columnsBlock,
    column: columnBlock,
    stack: stackBlock,
    card: cardBlock,
  },
})
