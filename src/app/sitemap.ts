import { MetadataRoute } from 'next'
import { getEntries } from '@/lib/rush-cms'
import { config } from '@/lib/config'
import type { BlogEntryData } from '@/types/rush-cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = config.site.url

	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5
		}
	]

	let blogPages: MetadataRoute.Sitemap = []

	try {
		const entries = await getEntries<BlogEntryData>(config.site.slug, config.collections.blog, {
			status: 'published'
		})

		blogPages = entries.map((entry) => ({
			url: `${baseUrl}/blog/${entry.slug}`,
			lastModified: new Date(entry.updated_at),
			changeFrequency: 'weekly' as const,
			priority: 0.7
		}))
	} catch (error) {
		console.error('Failed to fetch blog entries for sitemap:', error)
	}

	return [...staticPages, ...blogPages]
}
