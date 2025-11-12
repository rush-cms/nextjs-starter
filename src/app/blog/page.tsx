import { getEntries } from '@/lib/rush-cms'
import { formatDate } from '@/lib/date'
import { config } from '@/lib/config'
import { BlogCard } from '@/components/blog-card'
import type { BlogEntry } from '@/types/rush-cms'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Blog',
	description: 'Artigos e notícias do nosso blog'
}

export default async function BlogPage() {
	const entries = await getEntries<BlogEntry>(config.site.slug, config.collections.blog, {
		status: 'published'
	})

	return (
		<div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
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
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
					{entries.map((entry) => (
						<BlogCard
							key={entry.id}
							entry={entry}
							formatDate={formatDate}
						/>
					))}
				</div>
			)}
		</div>
	)
}
