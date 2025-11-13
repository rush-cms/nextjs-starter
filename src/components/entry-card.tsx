import Link from 'next/link'
import Image from 'next/image'
import type { RushCMSEntry } from '@/types/rush-cms'
import { getImageProps } from '@/lib/utils'

interface EntryCardProps {
	entry: RushCMSEntry
	formatDate: (dateString: string) => string
	headingLevel?: 'h2' | 'h3'
	imageHeight?: string
	priority?: boolean
	basePath?: string
}

export function EntryCard({
	entry,
	formatDate,
	headingLevel = 'h2',
	imageHeight = 'h-48 sm:h-56',
	priority = false,
	basePath = '/blog'
}: EntryCardProps) {
	const category = entry.data.category
	const image = getImageProps(entry.data.featured_image, entry.data.title)

	const HeadingTag = headingLevel

	return (
		<article className='group relative flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'>
			<Link
				href={`${basePath}/${entry.slug}`}
				className='absolute inset-0 z-10'
				aria-label={`Leia o artigo: ${entry.data.title}`}
			>
				<span className='sr-only'>Ler artigo: {entry.data.title}</span>
			</Link>

			{image && (
				<div className={`relative w-full ${imageHeight} overflow-hidden bg-gray-100`}>
					<Image
						src={image.url}
						alt={image.alt}
						fill
						priority={priority}
						className='object-cover group-hover:scale-105 transition-transform duration-300'
						sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
					/>
				</div>
			)}

			<div className='flex-1 flex flex-col p-5 sm:p-6'>
				{category && (
					<div className='mb-3'>
						<span className='inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
							{category.name}
						</span>
					</div>
				)}

				<HeadingTag className='text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
					{entry.data.title}
				</HeadingTag>

				{entry.data.excerpt && (
					<p className='text-sm sm:text-base text-gray-600 mb-4 line-clamp-3'>
						{entry.data.excerpt}
					</p>
				)}

				<div className='mt-auto pt-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100'>
					<time dateTime={entry.published_at}>
						{formatDate(entry.published_at)}
					</time>
					<span className='font-medium text-blue-600 relative z-20 pointer-events-none'>
						Ler mais →
					</span>
				</div>
			</div>
		</article>
	)
}
