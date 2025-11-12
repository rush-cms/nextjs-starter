'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface AnalyticsScriptProps {
	googleAnalyticsId?: string
	plausibleDomain?: string
}

export function AnalyticsScript({
	googleAnalyticsId,
	plausibleDomain
}: AnalyticsScriptProps) {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const searchParamsString = searchParams?.toString()

	useEffect(() => {
		if (process.env.NODE_ENV !== 'production') {
			return
		}

		const url = pathname + (searchParamsString ? `?${searchParamsString}` : '')

		if (googleAnalyticsId && window.gtag) {
			window.gtag('config', googleAnalyticsId, {
				page_path: url
			})
		}

		if (plausibleDomain && window.plausible) {
			window.plausible('pageview')
		}
	}, [pathname, searchParamsString, googleAnalyticsId, plausibleDomain])

	if (process.env.NODE_ENV !== 'production') {
		return null
	}

	return (
		<>
			{googleAnalyticsId && (
				<>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
						strategy='afterInteractive'
					/>
					<Script id='google-analytics' strategy='afterInteractive'>
						{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${googleAnalyticsId}', {
								page_path: window.location.pathname,
							});
						`}
					</Script>
				</>
			)}

			{plausibleDomain && (
				<Script
					defer
					data-domain={plausibleDomain}
					src='https://plausible.io/js/script.js'
					strategy='afterInteractive'
				/>
			)}
		</>
	)
}
