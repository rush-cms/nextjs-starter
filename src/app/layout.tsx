import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { getNavigationItems } from '@/lib/rush-cms'
import { Navigation } from '@/components/navigation'
import { config } from '@/lib/config'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		default: config.site.name,
		template: `%s | ${config.site.name}`
	},
	description: 'Modern website powered by Rush CMS',
	metadataBase: new URL(config.site.url)
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	let navigationItems: Awaited<ReturnType<typeof getNavigationItems>> = []

	try {
		navigationItems = await getNavigationItems(config.site.slug, config.navigation.main)
	} catch (error) {
		console.error('Failed to fetch navigation:', error)
	}

	return (
		<html lang='pt-BR'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
			>
				<Navigation items={navigationItems} />
				<main className='min-h-screen'>
					{children}
				</main>
				<footer className='bg-gray-900 text-white'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
						<div className='text-center'>
							<p className='text-sm sm:text-base text-gray-400'>
								© {new Date().getFullYear()} {config.site.name}. Todos os direitos reservados.
							</p>
							<p className='text-xs sm:text-sm text-gray-500 mt-2'>
								Powered by <a href='https://rushcms.com' target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300 transition-colors'>Rush CMS</a>
							</p>
						</div>
					</div>
				</footer>
			</body>
		</html>
	)
}
