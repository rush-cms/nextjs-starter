import { loadEnvConfig } from '@next/env'
import { vi, beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '@/mocks/server'

loadEnvConfig(process.cwd())

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

process.env.NEXT_PUBLIC_API_URL = 'https://api.test.com'
process.env.API_TOKEN = 'test-token-123'
process.env.SITE_ID = '1'
process.env.SITE_SLUG = 'test'
process.env.NEXT_PUBLIC_SITE_NAME = 'Test Site'
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.BLOG_COLLECTION_ID = '1'
process.env.PAGES_COLLECTION_ID = '2'
process.env.NAVIGATION_ID = '1'
process.env.CONTACT_FORM_KEY = 'contact'
process.env.REVALIDATE_SECRET = 'test-secret'

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn()
	}),
	useSearchParams: () => ({
		get: vi.fn()
	}),
	usePathname: () => '/',
	notFound: vi.fn(),
	redirect: vi.fn()
}))

vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
	useLocale: () => 'pt-BR'
}))

vi.mock('next-intl/server', () => ({
	getTranslations: async () => (key: string) => key,
	getMessages: async () => ({}),
	unstable_setRequestLocale: vi.fn()
}))

vi.mock('next/image', () => ({
	default: (props: any) => props
}))
