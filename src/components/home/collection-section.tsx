import Link from 'next/link'
import { EntryCard } from '@/components/entry-card'
import { formatDate } from '@/lib/date'
import type { RushCMSEntry, RushCMSCollection } from '@/types/rush-cms'

interface CollectionSectionProps {
	collection: RushCMSCollection
	entries: RushCMSEntry[]
	maxEntries?: number
}

const collectionIcons: Record<string, string> = {
	blog: '📝',
	news: '📰',
	noticias: '📰',
	events: '📅',
	eventos: '📅',
	team: '👥',
	equipe: '👥',
	projects: '💼',
	projetos: '💼',
	products: '🛍️',
	produtos: '🛍️',
	gallery: '🖼️',
	galeria: '🖼️',
	default: '📌'
}

function getCollectionIcon(slug: string): string {
	return collectionIcons[slug.toLowerCase()] || collectionIcons.default
}

export function CollectionSection({ collection, entries, maxEntries = 3 }: CollectionSectionProps) {
	const displayEntries = entries.slice(0, maxEntries)

	if (displayEntries.length === 0) {
		return null
	}

	const collectionName = collection.name || collection.slug.charAt(0).toUpperCase() + collection.slug.slice(1)
	const icon = getCollectionIcon(collection.slug)

	return (
		<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'>
			<div className='mb-8 sm:mb-12'>
				<div className='flex items-center gap-3 mb-3'>
					<span className='text-3xl sm:text-4xl'>{icon}</span>
					<h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900'>
						{collectionName}
					</h2>
				</div>
				{collection.description && (
					<p className='text-base sm:text-lg text-gray-600'>
						{collection.description}
					</p>
				)}
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
				{displayEntries.map((entry, index) => (
					<EntryCard
						key={entry.id}
						entry={entry}
						formatDate={formatDate}
						headingLevel='h3'
						imageHeight='h-48'
						priority={index < 3}
						basePath={`/${collection.slug}`}
					/>
				))}
			</div>

			{entries.length > maxEntries && (
				<div className='mt-10 sm:mt-12 text-center'>
					<Link
						href={`/${collection.slug}`}
						className='inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
					>
						Ver Todos em {collectionName}
						<svg
							className='ml-2 w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M17 8l4 4m0 0l-4 4m4-4H3'
							/>
						</svg>
					</Link>
				</div>
			)}
		</section>
	)
}
