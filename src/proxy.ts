import createNextIntlMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { defaultLocale } from './i18n/config'

const handleI18nRouting = createNextIntlMiddleware({
	locales: [defaultLocale],
	defaultLocale,
	localePrefix: 'never'
})

export function proxy(request: NextRequest) {
	return handleI18nRouting(request)
}

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
