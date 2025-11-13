import { getEntriesByCollection, getSiteName } from '@/lib/rush-cms'
import { config } from '@/lib/config'
import { generatePageMetadata } from '@/lib/metadata'
import { BlogListing } from '@/components/blog/blog-listing'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import type { BlogEntryData } from '@/types/rush-cms'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
	const siteName = await getSiteName(config.site.slug, config.site.name)

	return generatePageMetadata({
		title: 'Blog',
		description: 'Últimas notícias, artigos e atualizações do nosso blog',
		path: '/blog',
		siteName
	})
}

export default async function BlogPage() {
	const entries = await getEntriesByCollection<BlogEntryData>(config.site.slug, 'blog', {
		status: 'published'
	})

	return (
		<div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
			<Breadcrumbs items={[{ label: 'Blog' }]} />

			<div className='mb-8 sm:mb-12'>
				<h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4'>
					Blog
				</h1>
				<p className='text-base sm:text-lg text-gray-600'>
					Últimas notícias, artigos e atualizações
				</p>
			</div>

			{entries.length === 0 ? (
				<div className='text-center py-12 sm:py-16'>
					<p className='text-lg text-gray-600'>Nenhum artigo publicado ainda.</p>
				</div>
			) : (
				<BlogListing entries={entries} itemsPerPage={9} />
			)}
		</div>
	)
}
