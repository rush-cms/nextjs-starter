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
	const entry = await getEntryBySlug<BlogEntryData>(config.site.slug, slug, config.collections.blog)

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
		getImageFn: (): string | undefined => undefined,
		getAuthorFn: (): string | undefined => entry.author?.name || undefined
	})
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params
	const entry = await getEntryBySlug<BlogEntryData>(config.site.slug, slug, config.collections.blog)

	if (!entry) {
		notFound()
	}

	return <Article entry={entry} />
}
