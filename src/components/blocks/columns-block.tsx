import type { BlockRendererProps } from './types'
import type { ColumnsBlockData } from '@/types/rush-cms'
import { getBlockRenderer } from './index'

export function ColumnsBlock({ data }: BlockRendererProps) {
	const blockData = data as ColumnsBlockData['data']

	if (!blockData.columns || blockData.columns.length === 0) {
		return null
	}

	const columnCount = blockData.columns.length
	const gridClass = columnCount === 2
		? 'md:grid-cols-2'
		: columnCount === 3
			? 'md:grid-cols-3'
			: columnCount === 4
				? 'md:grid-cols-4'
				: 'md:grid-cols-2'

	return (
		<div className={`my-6 grid grid-cols-1 ${gridClass} gap-6`}>
			{blockData.columns.map((column, index) => (
				<div key={index} className='space-y-4'>
					{column.content.map((block, blockIndex) => {
						const BlockComponent = getBlockRenderer(block.type)
						return <BlockComponent key={blockIndex} type={block.type} data={block.data} />
					})}
				</div>
			))}
		</div>
	)
}
