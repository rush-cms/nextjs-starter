import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { getNavigationItems } from '@/lib/rush-cms'
import { Navigation } from '@/components/navigation'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Rush CMS Starter'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`
	},
	description: 'Modern website powered by Rush CMS',
	metadataBase: new URL(SITE_URL)
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const SITE_SLUG = process.env.SITE_SLUG || 'default'
	const NAVIGATION_ID = parseInt(process.env.NAVIGATION_ID || '1')

	let navigationItems: Awaited<ReturnType<typeof getNavigationItems>> = []

	try {
		navigationItems = await getNavigationItems(SITE_SLUG, NAVIGATION_ID)
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
								© {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
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
