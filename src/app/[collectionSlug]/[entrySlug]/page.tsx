import { notFound } from 'next/navigation'
import { getCollections, getEntriesByCollection, getEntryByCollectionAndSlug } from '@/lib/rush-cms'
import { Article } from '@/components/rush/article'
import { config } from '@/lib/config'
import { generateEntryMetadata } from '@/lib/metadata'
import type { BlogEntryData } from '@/types/rush-cms'
import type { Metadata } from 'next'

interface EntryPageProps {
	params: Promise<{
		collectionSlug: string
		entrySlug: string
	}>
}

export async function generateStaticParams() {
	const collections = await getCollections(config.site.slug)

	const params = []

	for (const collection of collections) {
		const entries = await getEntriesByCollection(
			config.site.slug,
			collection.slug,
			{ status: 'published' }
		)

		for (const entry of entries) {
			params.push({
				collectionSlug: collection.slug,
				entrySlug: entry.slug
			})
		}
	}

	return params
}

export async function generateMetadata({ params }: EntryPageProps): Promise<Metadata> {
	const { collectionSlug, entrySlug } = await params

	try {
		const entry = await getEntryByCollectionAndSlug<BlogEntryData>(
			config.site.slug,
			collectionSlug,
			entrySlug
		)

		if (!entry) {
			return {
				title: 'Entry not found'
			}
		}

		return generateEntryMetadata<BlogEntryData>({
			entry,
			path: `/${collectionSlug}/${entry.slug}`,
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
	const { collectionSlug, entrySlug } = await params

	try {
		const entry = await getEntryByCollectionAndSlug<BlogEntryData>(
			config.site.slug,
			collectionSlug,
			entrySlug
		)

		if (!entry) {
			notFound()
		}

		return <Article entry={entry} basePath={`/${collectionSlug}`} />
	} catch {
		notFound()
	}
}
