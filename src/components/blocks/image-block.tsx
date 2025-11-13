import Image from 'next/image'
import type { BlockRendererProps } from './types'
import type { ImageBlockData } from '@/types/rush-cms'

const alignmentClasses = {
	left: 'mr-auto',
	center: 'mx-auto',
	right: 'ml-auto'
}

export function ImageBlock({ data }: BlockRendererProps) {
	const blockData = data as ImageBlockData['data']

	if (!blockData.image?.url) {
		return null
	}

	const alignment = blockData.alignment || 'center'
	const alt = blockData.alt || blockData.image.alt || blockData.caption || 'Image'

	return (
		<figure className={`my-6 ${alignmentClasses[alignment]}`}>
			<div className='relative w-full overflow-hidden rounded-lg'>
				<Image
					src={blockData.image.url}
					alt={alt}
					width={1200}
					height={800}
					className='w-full h-auto'
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
					priority={false}
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
