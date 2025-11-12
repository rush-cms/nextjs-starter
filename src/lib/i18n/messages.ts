export const messages = {
	common: {
		home: 'Início',
		blog: 'Blog',
		pages: 'Páginas',
		readMore: 'Ler mais',
		backToHome: 'Voltar para o início',
		backToBlog: 'Voltar para o blog',
		loading: 'Carregando...',
		error: 'Erro',
		notFound: 'Não encontrado',
		skipToContent: 'Pular para o conteúdo principal'
	},
	time: {
		now: 'agora',
		minutesAgo: 'há {minutes} minutos',
		hoursAgo: 'há {hours} horas',
		daysAgo: 'há {days} dias',
		weeksAgo: 'há {weeks} semanas',
		monthsAgo: 'há {months} meses',
		yearsAgo: 'há {years} anos'
	},
	boolean: {
		yes: '✓ Sim',
		no: '✗ Não'
	},
	form: {
		success: 'Formulário enviado com sucesso!',
		error: 'Erro ao enviar formulário. Tente novamente.',
		required: 'Este campo é obrigatório',
		invalidEmail: 'Email inválido',
		submit: 'Enviar',
		sending: 'Enviando...'
	},
	blog: {
		title: 'Blog',
		noPosts: 'Nenhum post encontrado',
		readingTime: '{minutes} min de leitura',
		publishedOn: 'Publicado em',
		author: 'Por {author}',
		tags: 'Tags',
		relatedPosts: 'Posts relacionados',
		latestPosts: 'Últimos posts'
	},
	search: {
		placeholder: 'Buscar por título, conteúdo ou tags...',
		resultsCount: '{count} resultados encontrados',
		noResults: 'Nenhum resultado encontrado para sua busca'
	}
}

export type Messages = typeof messages
