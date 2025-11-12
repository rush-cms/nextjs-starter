import Link from 'next/link'
import Image from 'next/image'
import { getEntries } from '@/lib/rush-cms'
import type { RushCMSEntry } from '@/types/rush-cms'

const SITE_SLUG = process.env.SITE_SLUG || 'default'
const BLOG_COLLECTION_ID = parseInt(process.env.BLOG_COLLECTION_ID || '1')
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Rush CMS'

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

export default async function HomePage() {
	let featuredEntries: RushCMSEntry<BlogEntry>[] = []

	try {
		featuredEntries = await getEntries<BlogEntry>(SITE_SLUG, BLOG_COLLECTION_ID, {
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
							Bem-vindo ao {SITE_NAME}
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
						{featuredEntries.map((entry) => {
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
										<Link href={`/blog/${entry.slug}`} className='relative w-full h-48 overflow-hidden bg-gray-100'>
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

										<h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
											<Link href={`/blog/${entry.slug}`}>
												{entry.data.title}
											</Link>
										</h3>

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
