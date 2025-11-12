import Link from 'next/link'
import { getEntries } from '@/lib/rush-cms'
import { formatDate } from '@/lib/date'
import { config } from '@/lib/config'
import { generatePageMetadata } from '@/lib/metadata'
import { BlogCard } from '@/components/blog-card'
import type { BlogEntry, BlogEntryData } from '@/types/rush-cms'

export const metadata = generatePageMetadata({
	title: `${config.site.name} - Modern Content Platform`,
	description: 'Conteúdo moderno e dinâmico, powered by Rush CMS. Descubra nossos artigos e entre em contato.',
	path: '/'
})

export default async function HomePage() {
	let featuredEntries: BlogEntry[] = []

	try {
		featuredEntries = await getEntries<BlogEntryData>(config.site.slug, config.collections.blog, {
			status: 'published'
		})
		featuredEntries = featuredEntries.slice(0, 3)
	} catch (error) {
		console.error('Failed to fetch featured entries:', error)
	}

	return (
		<div className='w-full'>
			<section className='bg-gradient-to-br from-blue-600 to-blue-800 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32'>
					<div className='text-center max-w-3xl mx-auto'>
						<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
							Bem-vindo ao {config.site.name}
						</h1>
						<p className='text-lg sm:text-xl lg:text-2xl mb-8 text-blue-100'>
							Conteúdo moderno e dinâmico, powered by Rush CMS
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Link
								href='/blog'
								className='inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200'
							>
								Ver Blog
							</Link>
							<Link
								href='/contact'
								className='inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition-colors duration-200 border-2 border-white/20'
							>
								Entrar em Contato
							</Link>
						</div>
					</div>
				</div>
			</section>

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
