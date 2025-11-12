function validateEnv() {
	if (process.env.NEXT_PUBLIC_API_TOKEN) {
		throw new Error(
			'⚠️  SECURITY ERROR: API_TOKEN must not use NEXT_PUBLIC_ prefix! ' +
			'This would expose your secret token to the browser. ' +
			'Use API_TOKEN instead (server-side only).'
		)
	}

	const requiredEnvVars = [
		'NEXT_PUBLIC_API_URL',
		'API_TOKEN'
	]

	const missing = requiredEnvVars.filter(key => !process.env[key])

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(', ')}\n` +
			'Please check your .env file.'
		)
	}
}

if (process.env.NODE_ENV !== 'test') {
	validateEnv()
}

export const config = {
	site: {
		id: process.env.SITE_ID || '1',
		slug: process.env.SITE_SLUG || 'default',
		name: process.env.NEXT_PUBLIC_SITE_NAME || 'Rush CMS Starter',
		url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
	},
	api: {
		url: process.env.NEXT_PUBLIC_API_URL!,
		token: process.env.API_TOKEN!,
		revalidateTime: parseInt(process.env.REVALIDATE_TIME || '1800'),
		revalidateSecret: process.env.REVALIDATE_SECRET
	},
	collections: {
		blog: parseInt(process.env.BLOG_COLLECTION_ID || '1'),
		pages: parseInt(process.env.PAGES_COLLECTION_ID || '2')
	},
	navigation: {
		main: parseInt(process.env.NAVIGATION_ID || '1')
	},
	forms: {
		contact: process.env.CONTACT_FORM_KEY || 'contact'
	},
	media: {
		s3Url: process.env.NEXT_PUBLIC_S3_URL,
		bucket: process.env.NEXT_PUBLIC_S3_BUCKET
	}
} as const

export type Config = typeof config
