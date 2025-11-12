export function formatDate(dateString: string, locale = 'pt-BR'): string {
	const date = new Date(dateString)
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

export function formatDateTime(dateString: string, locale = 'pt-BR'): string {
	const date = new Date(dateString)
	return date.toLocaleString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

export function getRelativeTimeData(dateString: string) {
	const date = new Date(dateString)
	const now = new Date()
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

	if (diffInSeconds < 60) {
		return { key: 'time.now' as const, value: undefined }
	}
	if (diffInSeconds < 3600) {
		return { key: 'time.minutesAgo' as const, value: Math.floor(diffInSeconds / 60) }
	}
	if (diffInSeconds < 86400) {
		return { key: 'time.hoursAgo' as const, value: Math.floor(diffInSeconds / 3600) }
	}
	if (diffInSeconds < 604800) {
		return { key: 'time.daysAgo' as const, value: Math.floor(diffInSeconds / 86400) }
	}
	if (diffInSeconds < 2592000) {
		return { key: 'time.weeksAgo' as const, value: Math.floor(diffInSeconds / 604800) }
	}
	if (diffInSeconds < 31536000) {
		return { key: 'time.monthsAgo' as const, value: Math.floor(diffInSeconds / 2592000) }
	}

	return { key: 'time.yearsAgo' as const, value: Math.floor(diffInSeconds / 31536000) }
}
