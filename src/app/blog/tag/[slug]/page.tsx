import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEntriesByTag, getTags } from '@/lib/rush-cms'
import { config } from '@/lib/config'
import { EntryCard } from '@/components/entry-card'
import { formatDate } from '@/lib/date'
import type { BlogEntryData } from '@/types/rush-cms'
import type { Metadata } from 'next'

interface TagPageProps {
	params: Promise<{
		slug: string
	}>
}

export async function generateStaticParams() {
	try {
		const tags = await getTags(config.site.slug)
		return tags.map((tag) => ({
			slug: tag.slug
		}))
	} catch (error) {
		console.error('Failed to fetch tags for static params:', error)
		return []
	}
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
	const { slug } = await params

	try {
		const tags = await getTags(config.site.slug)
		const tag = tags.find(t => t.slug === slug)

		if (!tag) {
			return {
				title: 'Tag não encontrada'
			}
		}

		return {
			title: `Tag: ${tag.name}`,
			description: `Conteúdos relacionados à tag ${tag.name}`
		}
	} catch (error) {
		return {
			title: 'Tag não encontrada'
		}
	}
}

export default async function TagPage({ params }: TagPageProps) {
	const { slug } = await params

	let entries: Awaited<ReturnType<typeof getEntriesByTag<BlogEntryData>>> = []
	let tagName = slug

	try {
		const tags = await getTags(config.site.slug)
		const tag = tags.find(t => t.slug === slug)

		if (!tag) {
			notFound()
		}

		tagName = tag.name
		entries = await getEntriesByTag<BlogEntryData>(config.site.slug, slug)
	} catch (error) {
		console.error('Failed to fetch tag entries:', error)
		notFound()
	}

	return (
		<div className='w-full'>
			<section className='bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 sm:py-16 lg:py-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<div className='inline-flex items-center justify-center px-4 py-2 mb-4 text-sm font-medium bg-blue-700 rounded-full'>
							<span className='mr-2'>#</span>
							{tagName}
						</div>
						<h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4'>
							Conteúdos com a tag &ldquo;{tagName}&rdquo;
						</h1>
						<p className='text-lg sm:text-xl text-blue-100'>
							{entries.length} {entries.length === 1 ? 'conteúdo encontrado' : 'conteúdos encontrados'}
						</p>
					</div>
				</div>
			</section>

			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'>
				{entries.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
						{entries.map((entry) => (
							<EntryCard
								key={entry.id}
								entry={entry}
								formatDate={formatDate}
								headingLevel='h2'
								imageHeight='h-48'
							/>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<svg
								className='w-8 h-8 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
								/>
							</svg>
						</div>
						<h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>
							Nenhum conteúdo encontrado
						</h2>
						<p className='text-gray-600 mb-6'>
							Ainda não há conteúdos com a tag &ldquo;{tagName}&rdquo;
						</p>
						<Link
							href='/blog'
							className='inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
						>
							Ver Todos os Conteúdos
						</Link>
					</div>
				)}
			</section>
		</div>
	)
}
