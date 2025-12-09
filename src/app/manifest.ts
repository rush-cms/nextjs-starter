import type { MetadataRoute } from 'next'
import { config } from '@/lib/config'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: config.site.name,
		short_name: config.site.name,
		description: 'Modern website powered by Rush CMS',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/favicon.ico',
				sizes: 'any',
				type: 'image/x-icon'
			}
		]
	}
}
