import Image from 'next/image'
import type { RushCMSEntry } from '@/types/rush-cms'
import { sanitizeHTML } from '@/lib/sanitize'

interface ArticleProps {
	entry: RushCMSEntry
}

function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString('pt-BR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

export function Article({ entry }: ArticleProps) {
	const { data, published_at, updated_at } = entry
	const category = data.category as { name: string, slug: string } | undefined
	const featuredImage = data.featured_image as { url: string, alt?: string } | string | undefined
	const tags = data.tags as Array<{ name: string, slug: string }> | undefined
	const excerpt = typeof data.excerpt === 'string' ? data.excerpt : undefined
	const content = typeof data.content === 'string' ? data.content : undefined
	const title = typeof data.title === 'string' ? data.title : ''

	return (
		<article className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
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
				<p className='text-base sm:text-lg text-gray-700 italic mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200'>
					{excerpt}
				</p>
			)}

			{content && (
				<div
					className='prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg prose-img:shadow-md'
					dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
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
		</article>
	)
}
