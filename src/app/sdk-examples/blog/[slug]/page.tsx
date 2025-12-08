import { getEntry } from '@/lib/rush-cms-sdk'
import { BlocksRenderer } from '@rushcms/react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
	params: Promise<{
		slug: string
	}>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params
	const BLOG_COLLECTION_ID = parseInt(process.env.BLOG_COLLECTION_ID || '1')

	try {
		const entry = await getEntry(BLOG_COLLECTION_ID, slug)

		return {
			title: entry.meta.seo_title || entry.title,
			description: entry.meta.seo_description || entry.excerpt,
			openGraph: {
				title: entry.meta.seo_title || entry.title,
				description: entry.meta.seo_description || entry.excerpt,
				images: entry.meta.og_image ? [entry.meta.og_image] : []
			}
		}
	} catch {
		return {
			title: 'Blog Post Not Found'
		}
	}
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params
	const BLOG_COLLECTION_ID = parseInt(process.env.BLOG_COLLECTION_ID || '1')

	const entry = await getEntry(BLOG_COLLECTION_ID, slug)

	return (
		<article className='container mx-auto px-4 py-16 max-w-4xl'>
			{entry.featured_image && (
				<img
					src={entry.featured_image.url}
					alt={entry.featured_image.name}
					className='w-full h-96 object-cover rounded-lg mb-8'
				/>
			)}

			<header className='mb-8'>
				<h1 className='text-5xl font-bold mb-4'>{entry.title}</h1>

				<div className='flex items-center gap-4 text-gray-600 mb-4'>
					<span>By {entry.author.name}</span>
					<span>•</span>
					<time dateTime={entry.published_at}>
						{new Date(entry.published_at).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</time>
					{entry.data.reading_time && (
						<>
							<span>•</span>
							<span>{entry.data.reading_time} min read</span>
						</>
					)}
				</div>

				{entry.tags.length > 0 && (
					<div className='flex flex-wrap gap-2'>
						{entry.tags.map((tag) => (
							<span
								key={tag.id}
								className='px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'
							>
								{tag.name}
							</span>
						))}
					</div>
				)}
			</header>

			<div className='prose prose-lg max-w-none'>
				<BlocksRenderer blocks={entry.data.content} />
			</div>
		</article>
	)
}
