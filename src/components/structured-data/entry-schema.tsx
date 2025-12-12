import Script from 'next/script'
import { config } from '@/lib/config'
import type { RushCMSEntry } from '@/types/rush-cms'

interface ArticleSchemaProps<T = Record<string, unknown>> {
	entry: RushCMSEntry<T>
	getTitleFn?: (data: T) => string
	getDescriptionFn?: (data: T) => string
	getImageFn?: (data: T) => string | undefined
	getAuthorFn?: (data: T) => string | undefined
}

export function ArticleSchema<T = Record<string, unknown>>({
	entry,
	getTitleFn = (data: T) => (data as { title?: string }).title || 'Untitled',
	getDescriptionFn = (data: T) => (data as { excerpt?: string }).excerpt || '',
	getImageFn = (data: T) => (data as { featured_image?: string }).featured_image,
	getAuthorFn = (data: T) => (data as { author?: string }).author
}: ArticleSchemaProps<T>) {
	const title = getTitleFn(entry.data)
	const description = getDescriptionFn(entry.data)
	const image = getImageFn(entry.data)
	const author = getAuthorFn(entry.data)

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		description: description || title,
		image: image || `${config.site.url}/og-image.jpg`,
		datePublished: entry.published_at || entry.created_at,
		dateModified: entry.updated_at,
		author: author
			? {
				'@type': 'Person',
				name: author
			}
			: undefined,
		publisher: {
			'@type': 'Organization',
			name: config.site.name,
			logo: {
				'@type': 'ImageObject',
				url: `${config.site.url}/logo.png`
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${config.site.url}/${entry.slug}`
		}
	}

	return (
		<Script
			id='article-schema'
			type='application/ld+json'
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(schema)
			}}
		/>
	)
}

interface WebPageSchemaProps {
	title: string
	description: string
	url: string
}

export function WebPageSchema({ title, description, url }: WebPageSchemaProps) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: title,
		description,
		url,
		publisher: {
			'@type': 'Organization',
			name: config.site.name,
			logo: {
				'@type': 'ImageObject',
				url: `${config.site.url}/logo.png`
			}
		}
	}

	return (
		<Script
			id='webpage-schema'
			type='application/ld+json'
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(schema)
			}}
		/>
	)
}


