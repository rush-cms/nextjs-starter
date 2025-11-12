import Link from 'next/link'
import Image from 'next/image'
import { getEntries } from '@/lib/rush-cms'
import type { RushCMSEntry } from '@/types/rush-cms'
import type { Metadata } from 'next'

const SITE_SLUG = process.env.SITE_SLUG || 'default'
const BLOG_COLLECTION_ID = parseInt(process.env.BLOG_COLLECTION_ID || '1')

export const metadata: Metadata = {
	title: 'Blog',
	description: 'Artigos e notícias do nosso blog'
}

interface BlogEntry {
	title: string
	excerpt?: string
	featured_image?: string | { url: string, alt?: string }
	category?: { name: string, slug: string }
}

function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString('pt-BR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

export default async function BlogPage() {
	const entries = await getEntries<BlogEntry>(SITE_SLUG, BLOG_COLLECTION_ID, {
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
					{entries.map((entry) => {
						const category = entry.data.category
						const featuredImage = entry.data.featured_image
						const imageUrl = typeof featuredImage === 'string'
							? featuredImage
							: featuredImage?.url
						const imageAlt = typeof featuredImage === 'object' && featuredImage?.alt
							? featuredImage.alt
							: entry.data.title

						return (
							<article key={entry.id} className='group flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'>
								{imageUrl && (
									<Link href={`/blog/${entry.slug}`} className='relative w-full h-48 sm:h-56 overflow-hidden bg-gray-100'>
										<Image
											src={imageUrl}
											alt={imageAlt}
											fill
											className='object-cover group-hover:scale-105 transition-transform duration-300'
											sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
										/>
									</Link>
								)}

								<div className='flex-1 flex flex-col p-5 sm:p-6'>
									{category && (
										<div className='mb-3'>
											<span className='inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
												{category.name}
											</span>
										</div>
									)}

									<h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
										<Link href={`/blog/${entry.slug}`}>
											{entry.data.title}
										</Link>
									</h2>

									{entry.data.excerpt && (
										<p className='text-sm sm:text-base text-gray-600 mb-4 line-clamp-3'>
											{entry.data.excerpt}
										</p>
									)}

									<div className='mt-auto pt-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100'>
										<time dateTime={entry.published_at}>
											{formatDate(entry.published_at)}
										</time>
										<Link
											href={`/blog/${entry.slug}`}
											className='font-medium text-blue-600 hover:text-blue-800 transition-colors'
										>
											Ler mais →
										</Link>
									</div>
								</div>
							</article>
						)
					})}
				</div>
			)}
		</div>
	)
}
