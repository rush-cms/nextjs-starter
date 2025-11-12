import { LOCALE, TIME_LABELS } from './constants'

export function formatDate(dateString: string, locale = LOCALE): string {
	const date = new Date(dateString)
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

export function formatDateTime(dateString: string, locale = LOCALE): string {
	const date = new Date(dateString)
	return date.toLocaleString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

export function formatRelativeTime(dateString: string, locale = LOCALE): string {
	const date = new Date(dateString)
	const now = new Date()
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

	if (diffInSeconds < 60) return TIME_LABELS.now
	if (diffInSeconds < 3600) return TIME_LABELS.minutesAgo(Math.floor(diffInSeconds / 60))
	if (diffInSeconds < 86400) return TIME_LABELS.hoursAgo(Math.floor(diffInSeconds / 3600))
	if (diffInSeconds < 604800) return TIME_LABELS.daysAgo(Math.floor(diffInSeconds / 86400))

	return formatDate(dateString, locale)
}
