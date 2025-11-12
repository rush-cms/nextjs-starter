export const LOCALE = 'pt-BR'

export const TIME_LABELS = {
	now: 'agora',
	minutesAgo: (minutes: number) => `há ${minutes} minutos`,
	hoursAgo: (hours: number) => `há ${hours} horas`,
	daysAgo: (days: number) => `há ${days} dias`,
	weeksAgo: (weeks: number) => `há ${weeks} semanas`,
	monthsAgo: (months: number) => `há ${months} meses`,
	yearsAgo: (years: number) => `há ${years} anos`
}

export const BOOLEAN_LABELS = {
	yes: '✓ Sim',
	no: '✗ Não'
}

export const FORM_MESSAGES = {
	success: 'Formulário enviado com sucesso!',
	error: 'Erro ao enviar formulário. Tente novamente.',
	required: 'Este campo é obrigatório',
	invalidEmail: 'Email inválido'
}

export const IMAGE_SIZES = {
	FULL_WIDTH: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px',
	GRID_4_COL: '(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw',
	GRID_3_COL: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw',
	HERO: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px',
	THUMBNAIL: '(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw'
}

export const RATE_LIMIT = {
	MAX_REQUESTS: 10,
	WINDOW_MS: 60000
}

export const CACHE_TIMES = {
	NAVIGATION: 3600,
	ENTRIES: 1800,
	FORMS: 3600
}
