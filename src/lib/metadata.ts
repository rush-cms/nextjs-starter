import { Metadata } from 'next'
import { config } from '@/lib/config'
import type { RushCMSEntry } from '@/types/rush-cms'

interface PageMetadataOptions {
	title: string
	description: string
	path?: string
	image?: string
	noIndex?: boolean
	siteName?: string
}

interface EntryMetadataOptions<T = Record<string, unknown>> {
	entry: RushCMSEntry<T>
	path?: string
	type?: 'article' | 'website'
	getTitleFn?: (data: T) => string
	getDescriptionFn?: (data: T) => string
	getImageFn?: (data: T) => string | undefined
	getAuthorFn?: (data: T) => string | undefined
	siteName?: string
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
	const {
		title,
		description,
		path = '',
		image = '/og-image.jpg',
		noIndex = false,
		siteName = config.site.name
	} = options

	const url = `${config.site.url}${path}`
	const imageUrl = image.startsWith('http') ? image : `${config.site.url}${image}`

	return {
		title,
		description,
		robots: noIndex ? 'noindex,nofollow' : 'index,follow',
		openGraph: {
			title,
			description,
			url,
			siteName,
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: title
				}
			],
			locale: 'en_US',
			type: 'website'
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [imageUrl]
		},
		alternates: {
			canonical: url
		}
	}
}

export function generateEntryMetadata<T = Record<string, unknown>>(
	options: EntryMetadataOptions<T>
): Metadata {
	const {
		entry,
		path,
		type = 'article',
		getTitleFn = (data: T) => (data as { title?: string }).title || 'Untitled',
		getDescriptionFn = (data: T) => (data as { excerpt?: string }).excerpt || '',
		getImageFn = (data: T) => (data as { featured_image?: string }).featured_image,
		getAuthorFn = (data: T) => (data as { author?: string }).author,
		siteName = config.site.name
	} = options

	const title = getTitleFn(entry.data)
	const description = getDescriptionFn(entry.data) || title
	const featuredImage = getImageFn(entry.data)
	const author = getAuthorFn(entry.data)

	const url = path ? `${config.site.url}${path}` : `${config.site.url}/${entry.slug}`
	const imageUrl = featuredImage || `${config.site.url}/og-image.jpg`

	const publishedTime = entry.published_at || entry.created_at
	const modifiedTime = entry.updated_at

	const openGraphBase = {
		title,
		description,
		url,
		siteName,
		images: [
			{
				url: imageUrl,
				width: 1200,
				height: 630,
				alt: title
			}
		],
		locale: 'en_US',
		type
	}

	const openGraph = type === 'article'
		? {
				...openGraphBase,
				publishedTime,
				modifiedTime,
				authors: author ? [author] : undefined
			}
		: openGraphBase

	const baseMetadata: Metadata = {
		title,
		description,
		robots: entry.status === 'published' ? 'index,follow' : 'noindex,nofollow',
		authors: author ? [{ name: author }] : undefined,
		openGraph,
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [imageUrl]
		},
		alternates: {
			canonical: url
		}
	}

	return baseMetadata
}

export function generateOgImage(title: string, description?: string): string {
	const params = new URLSearchParams()
	params.set('title', title)

	if (description) {
		params.set('description', description)
	}

	return `/api/og?${params.toString()}`
}
