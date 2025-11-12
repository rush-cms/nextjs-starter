export function trackPageview(url: string, title?: string) {
	if (process.env.NODE_ENV !== 'production') {
		console.log('[Analytics] Pageview (dev mode):', url, title)
		return
	}

	if (typeof window.gtag !== 'undefined') {
		window.gtag('event', 'page_view', {
			page_path: url,
			page_title: title
		})
	}

	if (typeof window.plausible !== 'undefined') {
		window.plausible('pageview', {
			props: { path: url, title }
		})
	}
}

export function trackEvent(
	eventName: string,
	eventData?: Record<string, unknown>
) {
	if (process.env.NODE_ENV !== 'production') {
		console.log('[Analytics] Event (dev mode):', eventName, eventData)
		return
	}

	if (typeof window.gtag !== 'undefined') {
		window.gtag('event', eventName, eventData)
	}

	if (typeof window.plausible !== 'undefined') {
		window.plausible(eventName, {
			props: eventData
		})
	}
}

export function trackFormSubmit(formName: string, success: boolean) {
	trackEvent('form_submit', {
		form_name: formName,
		success: success ? 'true' : 'false'
	})
}

export function trackSearch(searchTerm: string, resultsCount: number) {
	trackEvent('search', {
		search_term: searchTerm,
		results_count: resultsCount
	})
}

export function trackShare(contentType: string, contentId: string, method: string) {
	trackEvent('share', {
		content_type: contentType,
		content_id: contentId,
		method
	})
}
