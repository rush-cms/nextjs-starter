import type { BlockRendererProps } from './types'
import type { YoutubeBlockData } from '@/types/rush-cms'

function getYouTubeEmbedUrl(url: string): string | null {
	try {
		const urlObj = new URL(url)

		if (urlObj.hostname === 'youtu.be') {
			const videoId = urlObj.pathname.slice(1)
			return `https://www.youtube.com/embed/${videoId}`
		}

		if (urlObj.hostname.includes('youtube.com')) {
			const videoId = urlObj.searchParams.get('v')
			if (videoId) {
				return `https://www.youtube.com/embed/${videoId}`
			}
		}

		return null
	} catch {
		return null
	}
}

export function YoutubeBlock({ data }: BlockRendererProps) {
	const blockData = data as YoutubeBlockData['data']

	if (!blockData.url) {
		return null
	}

	const embedUrl = getYouTubeEmbedUrl(blockData.url)

	if (!embedUrl) {
		return null
	}

	return (
		<figure className='my-6'>
			<div className='relative w-full overflow-hidden rounded-lg' style={{ paddingBottom: '56.25%' }}>
				<iframe
					src={embedUrl}
					title={blockData.title || 'YouTube video'}
					className='absolute top-0 left-0 w-full h-full'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
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
