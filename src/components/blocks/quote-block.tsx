import type { BlockRendererProps } from './types'
import type { QuoteBlockData } from '@/types/rush-cms'

export function QuoteBlock({ data }: BlockRendererProps) {
	const blockData = data as QuoteBlockData['data']

	if (!blockData.content) {
		return null
	}

	return (
		<blockquote className='my-8 border-l-4 border-gray-400 pl-6 pr-4 py-2'>
			<p className='text-xl italic text-gray-700 leading-relaxed mb-2'>
				{blockData.content}
			</p>
			{blockData.author && (
				<footer className='text-sm text-gray-600'>
					<cite className='not-italic'>
						— {blockData.author}
						{blockData.cite && (
							<>
								{', '}
								<span className='italic'>{blockData.cite}</span>
							</>
						)}
					</cite>
				</footer>
			)}
		</blockquote>
	)
}
