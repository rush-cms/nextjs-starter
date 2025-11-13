import { getBlockRenderer } from './index'
import type { BlockData } from '@/types/rush-cms'

interface BlockRendererProps {
	blocks: BlockData[]
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
	if (!blocks || blocks.length === 0) {
		return null
	}

	return (
		<div className='space-y-0'>
			{blocks.map((block, index) => {
				const BlockComponent = getBlockRenderer(block.type)
				return <BlockComponent key={index} type={block.type} data={block.data} />
			})}
		</div>
	)
}
