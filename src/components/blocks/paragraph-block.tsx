import type { BlockRendererProps } from './types'
import type { ParagraphBlockData } from '@/types/rush-cms'

export function ParagraphBlock({ data }: BlockRendererProps) {
	const blockData = data as ParagraphBlockData['data']

	if (!blockData.content) {
		return null
	}

	return (
		<p className='mb-4 leading-relaxed text-gray-700'>
			{blockData.content}
		</p>
	)
}
