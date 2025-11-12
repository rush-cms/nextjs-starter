'use client'

import Link from 'next/link'
import { useSite } from '@/lib/site-context'

export function HomeHero() {
	const { name: siteName } = useSite()

	return (
		<section className='bg-gradient-to-br from-blue-600 to-blue-800 text-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32'>
				<div className='text-center max-w-3xl mx-auto'>
					<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
						Bem-vindo ao {siteName}
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
	)
}
