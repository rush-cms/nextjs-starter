import DOMPurify from 'isomorphic-dompurify'

export interface SanitizeOptions {
	allowedTags?: string[]
	allowedAttributes?: Record<string, string[]>
	allowIframes?: boolean
}

const defaultOptions: SanitizeOptions = {
	allowedTags: [
		'p', 'br', 'strong', 'em', 'u', 's', 'a', 'img',
		'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
		'ul', 'ol', 'li',
		'blockquote', 'code', 'pre',
		'table', 'thead', 'tbody', 'tr', 'th', 'td',
		'div', 'span'
	],
	allowedAttributes: {
		'a': ['href', 'title', 'target', 'rel'],
		'img': ['src', 'alt', 'title', 'width', 'height'],
		'*': ['class']
	},
	allowIframes: false
}

export function sanitizeHTML(html: string, options: SanitizeOptions = {}): string {
	const mergedOptions = { ...defaultOptions, ...options }

	const config = {
		ALLOWED_TAGS: mergedOptions.allowedTags,
		ALLOWED_ATTR: Object.keys(mergedOptions.allowedAttributes || {}).reduce((acc, tag) => {
			const attrs = mergedOptions.allowedAttributes?.[tag] || []
			return [...acc, ...attrs]
		}, [] as string[]),
		ALLOW_DATA_ATTR: false,
		ALLOW_UNKNOWN_PROTOCOLS: false,
		ADD_TAGS: mergedOptions.allowIframes ? ['iframe'] : [],
		ADD_ATTR: mergedOptions.allowIframes ? ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] : []
	}

	if (mergedOptions.allowIframes) {
		config.ALLOWED_TAGS = [...(config.ALLOWED_TAGS || []), 'iframe']
		config.ALLOWED_ATTR = [...(config.ALLOWED_ATTR || []), 'src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
	}

	return DOMPurify.sanitize(html, config) as string
}

export function sanitizeText(text: string): string {
	return DOMPurify.sanitize(text, {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
		KEEP_CONTENT: true
	}) as string
}
