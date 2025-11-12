import { notFound } from 'next/navigation'
import { getEntryBySlug, getEntries } from '@/lib/rush-cms'
import { Article } from '@/components/rush/article'
import type { RushCMSEntry } from '@/types/rush-cms'
import type { Metadata } from 'next'

const SITE_SLUG = process.env.SITE_SLUG || 'default'
const BLOG_COLLECTION_ID = parseInt(process.env.BLOG_COLLECTION_ID || '1')

interface BlogPostPageProps {
	params: Promise<{
		slug: string
	}>
}

interface BlogEntry {
	title: string
	excerpt?: string
	content?: string
	featured_image?: string | { url: string, alt?: string }
}

export async function generateStaticParams() {
	const entries = await getEntries(SITE_SLUG, BLOG_COLLECTION_ID, {
		status: 'published'
	})

	return entries.map((entry) => ({
		slug: entry.slug
	}))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params
	const entry = await getEntryBySlug<BlogEntry>(SITE_SLUG, slug)

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
	const entry = await getEntryBySlug<BlogEntry>(SITE_SLUG, slug)

	if (!entry) {
		notFound()
	}

	return <Article entry={entry as unknown as RushCMSEntry} />
}
