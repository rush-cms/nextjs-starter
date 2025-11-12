import { notFound } from 'next/navigation'
import { getEntryBySlug, getEntries } from '@/lib/rush-cms'
import { Article } from '@/components/rush/article'
import { config } from '@/lib/config'
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

	const featuredImage = entry.data.featured_image
	const imageUrl = typeof featuredImage === 'string'
		? featuredImage
		: featuredImage?.url

	return {
		title: entry.data.title,
		description: entry.data.excerpt || entry.data.title,
		openGraph: {
			title: entry.data.title,
			description: entry.data.excerpt || entry.data.title,
			type: 'article',
			publishedTime: entry.published_at,
			modifiedTime: entry.updated_at,
			images: imageUrl ? [{ url: imageUrl }] : []
		}
	}
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params
	const entry = await getEntryBySlug<BlogEntryData>(config.site.slug, slug)

	if (!entry) {
		notFound()
	}

	return <Article entry={entry as unknown as RushCMSEntry} />
}
