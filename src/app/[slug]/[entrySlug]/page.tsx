import { notFound } from 'next/navigation'
import { getCollections, getEntriesByCollection, getEntryByCollectionAndSlug } from '@/lib/rush-cms'
import { Article } from '@/components/rush/article'
import { config } from '@/lib/config'
import { generateEntryMetadata } from '@/lib/metadata'
import type { BlogEntryData } from '@/types/rush-cms'
import type { Metadata } from 'next'

interface EntryPageProps {
	params: Promise<{
		slug: string
		entrySlug: string
	}>
}

export async function generateStaticParams() {
	const params = []

	try {
		const collections = await getCollections(config.site.slug)

		for (const collection of collections) {
			try {
				const entries = await getEntriesByCollection(
					config.site.slug,
					collection.slug,
					{ status: 'published' }
				)

				for (const entry of entries) {
					params.push({
						slug: collection.slug,
						entrySlug: entry.slug
					})
				}
			} catch (error) {
				console.error(`Failed to fetch entries for collection ${collection.slug}:`, error)
			}
		}
	} catch (error) {
		console.error('Failed to fetch collections for static params:', error)
	}

	return params
}

export async function generateMetadata({ params }: EntryPageProps): Promise<Metadata> {
	const { slug, entrySlug } = await params

	try {
		const entry = await getEntryByCollectionAndSlug<BlogEntryData>(
			config.site.slug,
			slug,
			entrySlug
		)

		if (!entry) {
			return {
				title: 'Entry not found'
			}
		}

		return generateEntryMetadata<BlogEntryData>({
			entry,
			path: `/${slug}/${entry.slug}`,
			type: 'article',
			getTitleFn: () => entry.title,
			getDescriptionFn: () => entry.excerpt || entry.title,
			getImageFn: () => entry.featured_image?.url,
			getAuthorFn: () => entry.author?.name
		})
	} catch {
		return {
			title: 'Entry not found'
		}
	}
}

export default async function EntryPage({ params }: EntryPageProps) {
	const { slug, entrySlug } = await params

	let entry

	try {
		entry = await getEntryByCollectionAndSlug<BlogEntryData>(
			config.site.slug,
			slug,
			entrySlug
		)
	} catch {
		notFound()
	}

	if (!entry) {
		notFound()
	}

	return <Article entry={entry} basePath={`/${slug}`} />
}
