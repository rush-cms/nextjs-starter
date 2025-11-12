import Link from 'next/link'
import type { RushCMSEntry } from '@/types/rush-cms'
import { formatDate } from '@/lib/date'
import { ArticleSchema, BreadcrumbSchema } from '@/components/structured-data/entry-schema'
import { ShareButtons } from '@/components/share/share-buttons'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { config } from '@/lib/config'

interface ArticleProps {
	entry: RushCMSEntry<Record<string, unknown>>
	showStructuredData?: boolean
	showBreadcrumbs?: boolean
	showToc?: boolean
	basePath?: string
}

export function Article({ entry, showStructuredData = true, showBreadcrumbs = true, showToc = true, basePath = '/blog' }: ArticleProps) {
	const { data, published_at, updated_at, title, excerpt, author } = entry
	const categories = data.categories as string[] | undefined
	const tags = data.tags as string[] | undefined
	const content = data.content as Array<{ type: string, data: Record<string, unknown> }> | undefined

	const currentUrl = `${config.site.url}${basePath}/${entry.slug}`

	return (
		<>
			{showStructuredData && (
				<>
					<ArticleSchema
						entry={entry}
						getTitleFn={() => entry.title || 'Untitled'}
						getDescriptionFn={() => entry.excerpt || ''}
						getImageFn={() => undefined}
						getAuthorFn={() => entry.author?.name}
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

			{categories && categories.length > 0 && (
				<div className='mb-3 sm:mb-4'>
					{categories.map((category, index) => (
						<span key={index} className='inline-block px-3 py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded-full mr-2'>
							{category}
						</span>
					))}
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

			{content && content.length > 0 && (
				<div className='prose prose-slate max-w-none mb-8'>
					{content.map((block, index) => {
						if (block.type === 'richtext' && block.data.content) {
							const richtextContent = block.data.content as { type: string, content?: unknown[] }
							if (richtextContent.content && Array.isArray(richtextContent.content)) {
								return (
									<div key={index}>
										{richtextContent.content.map((node: unknown, nodeIndex: number) => {
											const typedNode = node as { type?: string, content?: Array<{ type?: string, text?: string }> }
											if (typedNode.type === 'paragraph' && typedNode.content) {
												return (
													<p key={nodeIndex}>
														{typedNode.content.map((textNode, textIndex) => textNode.text || '').join('')}
													</p>
												)
											}
											return null
										})}
									</div>
								)
							}
						}
						return null
					})}
				</div>
			)}

			{tags && tags.length > 0 && (
				<div className='flex flex-wrap gap-2 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-200'>
					<span className='text-sm font-medium text-gray-900 mr-2'>Tags:</span>
					{tags.map((tag, index) => {
						const tagSlug = typeof tag === 'string' ? tag.toLowerCase().replace(/\s+/g, '-') : tag
						const tagName = typeof tag === 'string' ? tag : tag

						return (
							<Link
								key={index}
								href={`/blog/tag/${tagSlug}`}
								className='px-3 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200'
							>
								#{tagName}
							</Link>
						)
					})}
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
