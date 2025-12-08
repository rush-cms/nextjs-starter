import { getEntries } from '@/lib/rush-cms-sdk'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: 'Blog - RushCMS SDK Example',
	description: 'Example blog list using RushCMS SDK'
}

export default async function BlogListPage() {
	const BLOG_COLLECTION_ID = parseInt(process.env.BLOG_COLLECTION_ID || '1')

	const response = await getEntries(BLOG_COLLECTION_ID, {
		page: 1,
		per_page: 10
	})

	return (
		<div className='container mx-auto px-4 py-16'>
			<h1 className='text-4xl font-bold mb-8'>Blog Posts</h1>

			<div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
				{response.data.map((entry) => (
					<Link
						key={entry.id}
						href={`/sdk-examples/blog/${entry.slug}`}
						className='block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow'
					>
						{entry.featured_image && (
							<img
								src={entry.featured_image.url}
								alt={entry.featured_image.name}
								className='w-full h-48 object-cover rounded-md mb-4'
							/>
						)}

						<h2 className='text-2xl font-semibold mb-2'>{entry.title}</h2>

						{entry.excerpt && (
							<p className='text-gray-600 mb-4'>{entry.excerpt}</p>
						)}

						{entry.tags.length > 0 && (
							<div className='flex flex-wrap gap-2'>
								{entry.tags.map((tag) => (
									<span
										key={tag.id}
										className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded'
									>
										{tag.name}
									</span>
								))}
							</div>
						)}
					</Link>
				))}
			</div>

			{response.meta && (
				<div className='mt-12 flex justify-center gap-2'>
					{response.meta.current_page > 1 && (
						<Link
							href={`/sdk-examples/blog?page=${response.meta.current_page - 1}`}
							className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
						>
							Previous
						</Link>
					)}

					<span className='px-4 py-2'>
						Page {response.meta.current_page} of {response.meta.last_page}
					</span>

					{response.meta.current_page < response.meta.last_page && (
						<Link
							href={`/sdk-examples/blog?page=${response.meta.current_page + 1}`}
							className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
						>
							Next
						</Link>
					)}
				</div>
			)}
		</div>
	)
}
