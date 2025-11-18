import Link from 'next/link'
import { getCollections, getEntriesByCollection } from '@/lib/rush-cms'
import { config } from '@/lib/config'
import { HomeHero } from '@/components/home-hero'
import { CollectionSection } from '@/components/home/collection-section'
import type { BlogEntryData } from '@/types/rush-cms'

export default async function HomePage() {
	const collectionsWithEntries: Array<{
		collection: Awaited<ReturnType<typeof getCollections>>[0]
		entries: Awaited<ReturnType<typeof getEntriesByCollection<BlogEntryData>>>
	}> = []

	try {
		const collections = await getCollections(config.site.slug)

		for (const collection of collections) {
			try {
				const entries = await getEntriesByCollection<BlogEntryData>(
					config.site.slug,
					collection.slug,
					{ status: 'published' }
				)

				if (entries.length > 0) {
					collectionsWithEntries.push({ collection, entries })
				}
			} catch (error) {
				console.error(`Failed to fetch entries for collection ${collection.slug}:`, error)
			}
		}
	} catch (error) {
		console.error('Failed to fetch collections:', error)
	}

	return (
		<div className='w-full'>
			<HomeHero />

			{collectionsWithEntries.map(({ collection, entries }) => (
				<CollectionSection
					key={collection.id}
					collection={collection}
					entries={entries}
					maxEntries={3}
				/>
			))}

			<section className='bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'>
					<div className='max-w-3xl mx-auto text-center'>
						<h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6'>
							Pronto para começar?
						</h2>
						<p className='text-base sm:text-lg text-gray-600 mb-8'>
							Entre em contato conosco e descubra como podemos ajudar
						</p>
						<Link
							href='/contact'
							className='inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
						>
							Fale Conosco
						</Link>
					</div>
				</div>
			</section>
		</div>
	)
}
