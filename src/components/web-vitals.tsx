'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
	useReportWebVitals((metric) => {
		if (process.env.NODE_ENV === 'production') {
			const body = JSON.stringify({
				name: metric.name,
				value: metric.value,
				rating: metric.rating,
				delta: metric.delta,
				id: metric.id
			})

			const url = '/api/web-vitals'

			if (navigator.sendBeacon) {
				navigator.sendBeacon(url, body)
			} else {
				fetch(url, { body, method: 'POST', keepalive: true })
			}
		} else {
			console.log('[Web Vitals]', metric.name, metric.value, metric.rating)
		}
	})

	return null
}
