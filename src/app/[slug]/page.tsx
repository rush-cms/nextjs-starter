import { notFound } from 'next/navigation'
import {
	getEntryByCollectionAndSlug,
	getEntriesByCollection,
	getCollections
} from '@/lib/rush-cms'
import { Article } from '@/components/rush/article'
import { config } from '@/lib/config'
import { generateEntryMetadata, generatePageMetadata } from '@/lib/metadata'
import { BlogListing } from '@/components/blog/blog-listing'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import type { BlogEntryData, RushCMSCollection } from '@/types/rush-cms'
import type { Metadata } from 'next'

interface DynamicPageProps {
	params: Promise<{
		slug: string
	}>
}

async function isCollection(slug: string): Promise<RushCMSCollection | null> {
	try {
		const collections = await getCollections(config.site.slug)
		return collections.find(c => c.slug === slug) || null
	} catch {
		return null
	}
}

export async function generateStaticParams() {
	const params: Array<{ slug: string }> = []
	const rootCollectionSlug = config.routing.rootCollectionSlug

	if (rootCollectionSlug) {
		try {
			const entries = await getEntriesByCollection(
				config.site.slug,
				rootCollectionSlug,
				{ status: 'published' }
			)
			params.push(...entries.map(entry => ({ slug: entry.slug })))
		} catch (error) {
			console.error(`Failed to generate static params for root collection ${rootCollectionSlug}:`, error)
		}
	}

	try {
		const collections = await getCollections(config.site.slug)
		params.push(...collections.map(collection => ({ slug: collection.slug })))
	} catch (error) {
		console.error('Failed to generate static params for collections:', error)
	}

	return params
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
	const { slug } = await params
	const collection = await isCollection(slug)

	if (collection) {
		return generatePageMetadata({
			title: collection.name || slug.charAt(0).toUpperCase() + slug.slice(1),
			description: collection.description || `Browse all ${collection.name || slug} entries`,
			path: `/${slug}`,
			siteName: config.site.name
		})
	}

	const rootCollectionSlug = config.routing.rootCollectionSlug
	if (!rootCollectionSlug) {
		return { title: 'Page not found' }
	}

	try {
		const entry = await getEntryByCollectionAndSlug<BlogEntryData>(
			config.site.slug,
			rootCollectionSlug,
			slug
		)

		if (!entry) {
			return { title: 'Page not found' }
		}

		return generateEntryMetadata<BlogEntryData>({
			entry,
			path: `/${entry.slug}`,
			type: 'website',
			getTitleFn: () => entry.title,
			getDescriptionFn: () => entry.excerpt || entry.title,
			getImageFn: () => entry.featured_image?.url
		})
	} catch {
		return { title: 'Page not found' }
	}
}

export default async function DynamicPage({ params }: DynamicPageProps) {
	const { slug } = await params
	const collection = await isCollection(slug)

	if (collection) {
		let entries

		try {
			entries = await getEntriesByCollection<BlogEntryData>(
				config.site.slug,
				collection.slug,
				{ status: 'published' }
			)
		} catch (error) {
			console.error(`Failed to fetch entries for collection ${slug}:`, error)
			notFound()
		}

		const collectionName = collection.name || collection.slug.charAt(0).toUpperCase() + collection.slug.slice(1)

		return (
			<div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
				<Breadcrumbs items={[{ label: collectionName }]} />

				<div className='mb-8 sm:mb-12'>
					<h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4'>
						{collectionName}
					</h1>
					{collection.description && (
						<p className='text-base sm:text-lg text-gray-600'>
							{collection.description}
						</p>
					)}
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

	const rootCollectionSlug = config.routing.rootCollectionSlug
	if (!rootCollectionSlug) {
		notFound()
	}

	let entry

	try {
		entry = await getEntryByCollectionAndSlug<BlogEntryData>(
			config.site.slug,
			rootCollectionSlug,
			slug
		)
	} catch {
		notFound()
	}

	if (!entry) {
		notFound()
	}

	return <Article entry={entry} />
}
