import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import './globals.css'
import { getNavigationItems } from '@/lib/rush-cms'
import { Navigation } from '@/components/navigation'
import { config } from '@/lib/config'
import { AnalyticsScript } from '@/components/analytics/analytics-script'
import { logger } from '@/lib/logger'
import { locales } from '@/i18n/config'

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

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
	children,
	params
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale } = await params

	if (!locales.includes(locale as any)) {
		notFound()
	}

	const messages = await getMessages()
	const t = await getTranslations('common')
	let navigationItems: Awaited<ReturnType<typeof getNavigationItems>> = []

	try {
		navigationItems = await getNavigationItems(config.site.slug, config.navigation.main)
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
				<NextIntlClientProvider messages={messages}>
					<a
						href='#main-content'
						className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
					>
						{t('skipToContent')}
					</a>
					<AnalyticsScript
						googleAnalyticsId={googleAnalyticsId}
						plausibleDomain={plausibleDomain}
					/>
					<Navigation items={navigationItems} />
					<main id='main-content' className='min-h-screen'>
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
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
