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

export function formatRelativeTime(dateString: string, locale = 'pt-BR'): string {
	const date = new Date(dateString)
	const now = new Date()
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

	if (diffInSeconds < 60) return 'agora'
	if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} minutos`
	if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`
	if (diffInSeconds < 604800) return `há ${Math.floor(diffInSeconds / 86400)} dias`

	return formatDate(dateString, locale)
}
