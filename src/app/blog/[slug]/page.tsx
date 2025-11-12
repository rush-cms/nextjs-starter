import { notFound } from 'next/navigation'
import { getEntryBySlug, getEntries } from '@/lib/rush-cms'
import { Article } from '@/components/rush/article'
import { config } from '@/lib/config'
import { generateEntryMetadata } from '@/lib/metadata'
import type { RushCMSEntry, BlogEntry, BlogEntryData } from '@/types/rush-cms'
import type { Metadata } from 'next'

interface BlogPostPageProps {
	params: Promise<{
		slug: string
	}>
}

export async function generateStaticParams() {
	const entries = await getEntries(config.site.slug, config.collections.blog, {
		status: 'published'
	})

	return entries.map((entry) => ({
		slug: entry.slug
	}))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params
	const entry = await getEntryBySlug<BlogEntryData>(config.site.slug, slug)

	if (!entry) {
		return {
			title: 'Post não encontrado'
		}
	}

	return generateEntryMetadata<BlogEntryData>({
		entry,
		path: `/blog/${entry.slug}`,
		type: 'article',
		getTitleFn: (data) => data.title,
		getDescriptionFn: (data) => data.excerpt || data.title,
		getImageFn: (data): string | undefined => {
			const img = data.featured_image
			if (typeof img === 'string') return img
			if (img && typeof img === 'object' && 'url' in img) {
				return typeof img.url === 'string' ? img.url : undefined
			}
			return undefined
		},
		getAuthorFn: (data): string | undefined => data.author
	})
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params
	const entry = await getEntryBySlug<BlogEntryData>(config.site.slug, slug)

	if (!entry) {
		notFound()
	}

	return <Article entry={entry} />
}
