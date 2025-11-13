'use client'

import type { BlockRendererProps } from './types'
import type { VideoBlockData } from '@/types/rush-cms'

export function VideoBlock({ data }: BlockRendererProps) {
	const blockData = data as VideoBlockData['data']

	if (!blockData.url) {
		return null
	}

	return (
		<figure className='my-6'>
			<div className='relative w-full overflow-hidden rounded-lg bg-black'>
				<video
					src={blockData.url}
					controls
					className='w-full h-auto'
					poster={blockData.poster}
					preload='metadata'
				>
					Your browser does not support the video tag.
				</video>
			</div>
			{blockData.caption && (
				<figcaption className='mt-2 text-sm text-gray-600 text-center italic'>
					{blockData.caption}
				</figcaption>
			)}
		</figure>
	)
}
