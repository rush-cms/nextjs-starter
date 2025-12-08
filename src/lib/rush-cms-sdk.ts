import { RushCMSClient } from '@rushcms/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_TOKEN = process.env.API_TOKEN
const SITE_SLUG = process.env.SITE_SLUG

if (!API_URL) {
	throw new Error('NEXT_PUBLIC_API_URL environment variable is not set')
}

if (!API_TOKEN) {
	throw new Error('API_TOKEN environment variable is not set')
}

if (!SITE_SLUG) {
	throw new Error('SITE_SLUG environment variable is not set')
}

export const rushcmsClient = new RushCMSClient({
	baseUrl: API_URL,
	apiToken: API_TOKEN,
	siteSlug: SITE_SLUG,
	cache: {
		enabled: process.env.NODE_ENV === 'production',
		ttl: parseInt(process.env.CACHE_TTL || '7200')
	}
})

export async function getEntries(collectionId: number, params?: {
	page?: number
	per_page?: number
	tags?: string | string[]
	tag_operator?: 'any' | 'all'
}) {
	return rushcmsClient.getEntries(collectionId, params)
}

export async function getEntry(collectionId: number, slug: string) {
	return rushcmsClient.getEntry(collectionId, slug)
}

export function clearCache() {
	rushcmsClient.clearCache()
}

export {
	RushCMSError,
	RushCMSNotFoundError,
	RushCMSUnauthorizedError,
	RushCMSForbiddenError
} from '@rushcms/client'

export type {
	Entry,
	PaginatedResponse,
	Block,
	RichTextBlock,
	CalloutBlock,
	ImageBlock,
	VideoBlock,
	YoutubeBlock,
	CodeBlock
} from '@rushcms/types'
