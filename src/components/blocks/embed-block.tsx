import type { BlockRendererProps } from './types'
import type { EmbedBlockData } from '@/types/rush-cms'

export function EmbedBlock({ data }: BlockRendererProps) {
	const blockData = data as EmbedBlockData['data']

	if (!blockData.url) {
		return null
	}

	const aspectRatio = blockData.aspectRatio || '16/9'
	const paddingBottom = aspectRatio === '16/9' ? '56.25%' : aspectRatio === '4/3' ? '75%' : '56.25%'

	return (
		<figure className='my-6'>
			<div className='relative w-full overflow-hidden rounded-lg' style={{ paddingBottom }}>
				<iframe
					src={blockData.url}
					title={blockData.title || 'Embedded content'}
					className='absolute top-0 left-0 w-full h-full'
					allowFullScreen
				/>
			</div>
			{blockData.caption && (
				<figcaption className='mt-2 text-sm text-gray-600 text-center italic'>
					{blockData.caption}
				</figcaption>
			)}
		</figure>
	)
}
