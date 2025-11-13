import Link from 'next/link'
import { getEntriesByCollection } from '@/lib/rush-cms'
import { formatDate } from '@/lib/date'
import { config } from '@/lib/config'
import { BlogCard } from '@/components/blog-card'
import { HomeHero } from '@/components/home-hero'
import type { BlogEntryData } from '@/types/rush-cms'

export default async function HomePage() {
	let featuredEntries: Awaited<ReturnType<typeof getEntriesByCollection<BlogEntryData>>> = []

	try {
		const entries = await getEntriesByCollection<BlogEntryData>(config.site.slug, 'blog', {
			status: 'published'
		})
		featuredEntries = entries.slice(0, 3)
	} catch (error) {
		console.error('Failed to fetch featured entries:', error)
	}

	return (
		<div className='w-full'>
			<HomeHero />

			{featuredEntries.length > 0 && (
				<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'>
					<div className='mb-8 sm:mb-12'>
						<h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3'>
							Últimos Artigos
						</h2>
						<p className='text-base sm:text-lg text-gray-600'>
							Confira nossas publicações mais recentes
						</p>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
						{featuredEntries.map((entry, index) => (
							<BlogCard
								key={entry.id}
								entry={entry}
								formatDate={formatDate}
								headingLevel='h3'
								imageHeight='h-48'
								priority={index < 3}
							/>
						))}
					</div>

					<div className='mt-10 sm:mt-12 text-center'>
						<Link
							href='/blog'
							className='inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
						>
							Ver Todos os Artigos
						</Link>
					</div>
				</section>
			)}

			<section className='bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'>
					<div className='max-w-3xl mx-auto text-center'>
						<h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6'>
							Pronto para começar?
						</h2>
						<p className='text-base sm:text-lg text-gray-600 mb-8'>
							Entre em contato conosco e descubra como podemos ajudar
						</p>
						<Link
							href='/contact'
							className='inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
						>
							Fale Conosco
						</Link>
					</div>
				</div>
			</section>
		</div>
	)
}
