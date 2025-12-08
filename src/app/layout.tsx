import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import '@/lib/suppress-dev-errors'
import { getNavigation, getTeams } from '@/lib/rush-cms'
import { Navigation } from '@/components/navigation'
import { config } from '@/lib/config'
import { AnalyticsScript } from '@/components/analytics/analytics-script'
import { logger } from '@/lib/logger'
import { messages } from '@/lib/i18n/messages'
import { SiteProvider } from '@/lib/site-context'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export async function generateMetadata(): Promise<Metadata> {
	let siteName = config.site.name

	try {
		const teams = await getTeams()
		const currentTeam = teams.find(team => team.slug === config.site.slug)

		if (currentTeam) {
			siteName = currentTeam.name
		}
	} catch (error) {
		logger.error('Failed to fetch team info for metadata', { error })
	}

	return {
		title: {
			default: siteName,
			template: `%s | ${siteName}`
		},
		description: 'Modern website powered by Rush CMS',
		metadataBase: new URL(config.site.url)
	}
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = config.site.locale
	let navigationItems: Awaited<ReturnType<typeof getNavigation>>['items'] = []
	let siteName = config.site.name

	try {
		const teams = await getTeams()
		const currentTeam = teams.find(team => team.slug === config.site.slug)

		if (currentTeam) {
			siteName = currentTeam.name
		}
	} catch (error) {
		logger.error('Failed to fetch team info', { error })
	}

	try {
		const navigation = await getNavigation(config.site.slug, config.navigation.main)
		navigationItems = navigation.items
	} catch (error) {
		logger.error('Failed to fetch navigation', { error })
	}

	const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID
	const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

	return (
		<html lang={locale}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
			>
				<SiteProvider name={siteName}>
					<a
						href='#main-content'
						className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
					>
						{messages.common.skipToContent}
					</a>
					<Suspense fallback={null}>
						<AnalyticsScript
							googleAnalyticsId={googleAnalyticsId}
							plausibleDomain={plausibleDomain}
						/>
					</Suspense>
					<Navigation items={navigationItems} siteName={siteName} />
					<main id='main-content' className='min-h-screen'>
						{children}
					</main>
					<footer className='bg-gray-900 text-white'>
						<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
							<div className='text-center'>
								<p className='text-sm sm:text-base text-gray-400'>
									© {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
								</p>
								<p className='text-xs sm:text-sm text-gray-500 mt-2'>
									Powered by <a href='https://rushcms.com' target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300 transition-colors'>Rush CMS</a>
								</p>
							</div>
						</div>
					</footer>
				</SiteProvider>
			</body>
		</html>
	)
}
