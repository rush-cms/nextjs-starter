import type { ComponentType } from 'react'
import type { BlockRendererProps } from './types'
import { UnknownBlock } from './unknown-block'
import { RichTextBlock } from './richtext-block'
import { QuoteBlock } from './quote-block'
import { CalloutBlock } from './callout-block'
import { ToggleBlock } from './toggle-block'
import { ParagraphBlock } from './paragraph-block'
import { ImageBlock } from './image-block'
import { GalleryBlock } from './gallery-block'
import { VideoBlock } from './video-block'
import { YoutubeBlock } from './youtube-block'
import { EmbedBlock } from './embed-block'
import { BookmarkBlock } from './bookmark-block'
import { AlertBlock } from './alert-block'
import { DividerBlock } from './divider-block'
import { CodeBlock } from './code-block'
import { ColumnsBlock } from './columns-block'
import { ButtonBlock } from './button-block'

export const BlockRenderers: Record<string, ComponentType<BlockRendererProps>> = {
	richtext: RichTextBlock,
	quote: QuoteBlock,
	callout: CalloutBlock,
	toggle: ToggleBlock,
	paragraph: ParagraphBlock,
	image: ImageBlock,
	gallery: GalleryBlock,
	video: VideoBlock,
	youtube: YoutubeBlock,
	embed: EmbedBlock,
	bookmark: BookmarkBlock,
	alert: AlertBlock,
	divider: DividerBlock,
	code: CodeBlock,
	columns: ColumnsBlock,
	button: ButtonBlock
}

export function getBlockRenderer(type: string): ComponentType<BlockRendererProps> {
	return BlockRenderers[type] || UnknownBlock
}

export { UnknownBlock }
export type { BlockRendererProps }
