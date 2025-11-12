import { MetadataRoute } from 'next'
import { config } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
	const baseUrl = config.site.url

	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/api/', '/admin/']
			}
		],
		sitemap: `${baseUrl}/sitemap.xml`
	}
}
