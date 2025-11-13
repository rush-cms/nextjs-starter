import type { BlockRendererProps } from './types'
import type { BookmarkBlockData } from '@/types/rush-cms'

export function BookmarkBlock({ data }: BlockRendererProps) {
	const blockData = data as BookmarkBlockData['data']

	if (!blockData.url) {
		return null
	}

	let domain = ''
	try {
		const urlObj = new URL(blockData.url)
		domain = urlObj.hostname.replace('www.', '')
	} catch {
		domain = blockData.url
	}

	return (
		<a
			href={blockData.url}
			target='_blank'
			rel='noopener noreferrer'
			className='block my-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all overflow-hidden'
		>
			<div className='flex'>
				<div className='flex-1 p-4'>
					{blockData.title && (
						<h3 className='font-bold text-lg mb-1 text-gray-900 line-clamp-2'>
							{blockData.title}
						</h3>
					)}
					{blockData.description && (
						<p className='text-sm text-gray-600 mb-2 line-clamp-2'>
							{blockData.description}
						</p>
					)}
					<div className='flex items-center gap-2 text-xs text-gray-500'>
						<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
							<path
								fillRule='evenodd'
								d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
								clipRule='evenodd'
							/>
						</svg>
						<span>{domain}</span>
					</div>
				</div>
				{blockData.image && (
					<div
						className='w-32 md:w-48 flex-shrink-0 bg-cover bg-center'
						style={{ backgroundImage: `url(${blockData.image})` }}
					/>
				)}
			</div>
		</a>
	)
}
