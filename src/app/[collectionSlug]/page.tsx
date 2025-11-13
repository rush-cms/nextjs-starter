import { getCollections, getEntriesByCollection, getSiteName } from '@/lib/rush-cms'
import { config } from '@/lib/config'
import { generatePageMetadata } from '@/lib/metadata'
import { BlogListing } from '@/components/blog/blog-listing'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import type { BlogEntryData } from '@/types/rush-cms'
import type { Metadata } from 'next'

interface CollectionPageProps {
	params: Promise<{
		collectionSlug: string
	}>
}

export async function generateStaticParams() {
	const collections = await getCollections(config.site.slug)

	return collections.map((collection) => ({
		collectionSlug: collection.slug
	}))
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
	const { collectionSlug } = await params
	const siteName = await getSiteName(config.site.slug, config.site.name)

	return generatePageMetadata({
		title: collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1),
		description: `Browse all ${collectionSlug} entries`,
		path: `/${collectionSlug}`,
		siteName
	})
}

export default async function CollectionPage({ params }: CollectionPageProps) {
	const { collectionSlug } = await params

	const entries = await getEntriesByCollection<BlogEntryData>(
		config.site.slug,
		collectionSlug,
		{ status: 'published' }
	)

	const collectionName = collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)

	return (
		<div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
			<Breadcrumbs items={[{ label: collectionName }]} />

			<div className='mb-8 sm:mb-12'>
				<h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4'>
					{collectionName}
				</h1>
				<p className='text-base sm:text-lg text-gray-600'>
					Browse all {collectionName.toLowerCase()} entries
				</p>
			</div>

			{entries.length === 0 ? (
				<div className='text-center py-12 sm:py-16'>
					<p className='text-lg text-gray-600'>No published entries yet.</p>
				</div>
			) : (
				<BlogListing entries={entries} itemsPerPage={9} />
			)}
		</div>
	)
}
