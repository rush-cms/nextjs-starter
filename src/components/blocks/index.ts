import type { ComponentType } from 'react'
import type { BlockRendererProps } from './types'
import { UnknownBlock } from './unknown-block'

export const BlockRenderers: Record<string, ComponentType<BlockRendererProps>> = {
	// Basic blocks (will be implemented)
	// richtext: RichTextBlock,
	// quote: QuoteBlock,
	// callout: CalloutBlock,
	// toggle: ToggleBlock,
	// paragraph: ParagraphBlock,

	// Media blocks (will be implemented)
	// image: ImageBlock,
	// gallery: GalleryBlock,
	// video: VideoBlock,

	// Embed blocks (will be implemented)
	// youtube: YoutubeBlock,
	// embed: EmbedBlock,
	// bookmark: BookmarkBlock,

	// Advanced blocks (will be implemented)
	// alert: AlertBlock,
	// divider: DividerBlock,
	// code: CodeBlock,
	// columns: ColumnsBlock,
	// button: ButtonBlock
}

export function getBlockRenderer(type: string): ComponentType<BlockRendererProps> {
	return BlockRenderers[type] || UnknownBlock
}

export { UnknownBlock }
export type { BlockRendererProps }
