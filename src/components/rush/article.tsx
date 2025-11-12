import Image from 'next/image'
import type { RushCMSEntry } from '@/types/rush-cms'
import { sanitizeHTML } from '@/lib/sanitize'
import { formatDate } from '@/lib/date'
import { ArticleSchema, BreadcrumbSchema } from '@/components/structured-data/entry-schema'
import { ShareButtons } from '@/components/share/share-buttons'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { ArticleContent } from './article-content'
import { config } from '@/lib/config'

interface ArticleProps {
	entry: RushCMSEntry<Record<string, unknown>>
	showStructuredData?: boolean
	showBreadcrumbs?: boolean
	showToc?: boolean
	basePath?: string
}

export function Article({ entry, showStructuredData = true, showBreadcrumbs = true, showToc = true, basePath = '/blog' }: ArticleProps) {
	const { data, published_at, updated_at } = entry
	const category = data.category as { name: string, slug: string } | undefined
	const featuredImage = data.featured_image as { url: string, alt?: string } | string | undefined
	const tags = data.tags as Array<{ name: string, slug: string }> | undefined
	const excerpt = typeof data.excerpt === 'string' ? data.excerpt : undefined
	const content = typeof data.content === 'string' ? data.content : undefined
	const title = typeof data.title === 'string' ? data.title : ''
	const author = typeof data.author === 'string' ? data.author : undefined

	const currentUrl = `${config.site.url}${basePath}/${entry.slug}`

	return (
		<>
			{showStructuredData && (
				<>
					<ArticleSchema
						entry={entry}
						getTitleFn={(data) => (data.title as string) || 'Untitled'}
						getDescriptionFn={(data) => (data.excerpt as string) || ''}
						getImageFn={(data) => {
							const img = data.featured_image
							return typeof img === 'string' ? img : (img as { url?: string })?.url
						}}
						getAuthorFn={(data) => data.author as string | undefined}
					/>
					<BreadcrumbSchema
						items={[
							{ name: 'Home', url: config.site.url },
							{ name: basePath.replace('/', '').charAt(0).toUpperCase() + basePath.slice(2), url: `${config.site.url}${basePath}` },
							{ name: title, url: `${config.site.url}${basePath}/${entry.slug}` }
						]}
					/>
				</>
			)}
			<article className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
			{showBreadcrumbs && (
				<Breadcrumbs
					items={[
						{ label: basePath.replace('/', '').charAt(0).toUpperCase() + basePath.slice(2), href: basePath },
						{ label: title }
					]}
				/>
			)}

			{category && (
				<div className='mb-3 sm:mb-4'>
					<span className='inline-block px-3 py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded-full'>
						{category.name}
					</span>
				</div>
			)}

			<h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight'>
				{title}
			</h1>

			<div className='flex flex-wrap gap-2 sm:gap-4 text-sm text-gray-600 mb-6 sm:mb-8'>
				<time dateTime={published_at} className='flex items-center gap-1'>
					<span className='hidden sm:inline'>Publicado em</span>
					<span className='sm:hidden'>📅</span>
					{formatDate(published_at)}
				</time>
				{updated_at !== published_at && (
					<span className='flex items-center gap-1'>
						<span className='hidden sm:inline'>• Atualizado em</span>
						<span className='sm:hidden'>🔄</span>
						{formatDate(updated_at)}
					</span>
				)}
			</div>

			{featuredImage && (
				<div className='relative w-full h-48 sm:h-64 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10 rounded-lg overflow-hidden bg-gray-100'>
					<Image
						src={typeof featuredImage === 'string' ? featuredImage : featuredImage.url}
						alt={typeof featuredImage === 'object' && featuredImage.alt ? featuredImage.alt : title}
						fill
						className='object-cover'
						priority
						sizes='(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px'
					/>
				</div>
			)}

			{excerpt && (
				<p className='text-base sm:text-lg text-gray-700 italic mb-6 sm:mb-8'>
					{excerpt}
				</p>
			)}

			<div className='mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200'>
				<ShareButtons
					url={currentUrl}
					title={title}
					description={excerpt || title}
					variant='default'
					showLabels={false}
				/>
			</div>

			{content && (
				<ArticleContent
					content={sanitizeHTML(content)}
					showToc={showToc}
				/>
			)}

			{tags && tags.length > 0 && (
				<div className='flex flex-wrap gap-2 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-200'>
					<span className='text-sm font-medium text-gray-900 mr-2'>Tags:</span>
					{tags.map((tag) => (
						<a
							key={tag.slug}
							href={`/blog/tag/${tag.slug}`}
							className='px-3 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200'
						>
							#{tag.name}
						</a>
					))}
				</div>
			)}

			<div className='mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-200'>
				<ShareButtons
					url={currentUrl}
					title={title}
					description={excerpt || title}
					variant='default'
					showLabels={true}
				/>
			</div>
		</article>
		</>
	)
}
