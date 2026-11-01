import {
  BlockNoteSchema,
  createCodeBlockSpec,
  defaultBlockSpecs,
} from "@blocknote/core"
import { codeBlockOptions } from "@blocknote/code-block"

import { calloutBlock } from "./blocks/callout-block"
import { youtubeBlock } from "./blocks/youtube-block"
import { pageCollectionBlock } from "./blocks/page-collection-block"
import { callToActionBlock, featureGridBlock, heroBlock } from "./blocks/web-page-blocks"
import { columnBlock, columnsBlock, sectionBlock } from "./blocks/layout-blocks"

export const editorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    codeBlock: createCodeBlockSpec(codeBlockOptions),
    callout: calloutBlock,
    youtube: youtubeBlock,
    pageCollection: pageCollectionBlock,
    hero: heroBlock,
    featureGrid: featureGridBlock,
    callToAction: callToActionBlock,
    section: sectionBlock,
    columns: columnsBlock,
    column: columnBlock,
  },
})
