import { notFound } from 'next/navigation'
import { getEntriesByCollection, getEntryByCollectionAndSlug } from '@/lib/rush-cms'
import { Article } from '@/components/rush/article'
import { config } from '@/lib/config'
import { generateEntryMetadata } from '@/lib/metadata'
import type { BlogEntryData } from '@/types/rush-cms'
import type { Metadata } from 'next'

interface BlogPostPageProps {
	params: Promise<{
		slug: string
	}>
}

export async function generateStaticParams() {
	try {
		const entries = await getEntriesByCollection(config.site.slug, 'blog', {
			status: 'published'
		})

		return entries.map((entry) => ({
			slug: entry.slug
		}))
	} catch (error) {
		console.error('Failed to generate static params for blog posts:', error)
		return []
	}
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params

	try {
		const entry = await getEntryByCollectionAndSlug<BlogEntryData>(config.site.slug, 'blog', slug)

		if (!entry) {
			return {
				title: 'Post não encontrado'
			}
		}

		return generateEntryMetadata<BlogEntryData>({
			entry,
			path: `/blog/${entry.slug}`,
			type: 'article',
			getTitleFn: () => entry.title,
			getDescriptionFn: () => entry.excerpt || entry.title,
			getImageFn: () => entry.featured_image?.url,
			getAuthorFn: () => entry.author?.name
		})
	} catch {
		return {
			title: 'Post não encontrado'
		}
	}
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params

	let entry

	try {
		entry = await getEntryByCollectionAndSlug<BlogEntryData>(config.site.slug, 'blog', slug)
	} catch {
		notFound()
	}

	if (!entry) {
		notFound()
	}

	return <Article entry={entry} />
}
