import type {
	RushCMSResponse,
	RushCMSPaginatedResponse,
	RushCMSEntry,
	RushCMSCollection,
	RushCMSNavigation,
	RushCMSNavigationItem,
	RushCMSForm,
	RushCMSSite,
	GetEntriesParams,
	FetchAPIOptions,
	RushCMSError as RushCMSErrorType,
	RushCMSErrorResponse
} from '@/types/rush-cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_TOKEN = process.env.API_TOKEN
const SITE_ID = process.env.SITE_ID || '1'
const REVALIDATE_TIME = parseInt(process.env.REVALIDATE_TIME || '1800')

export class RushCMSError extends Error {
	constructor(
		message: string,
		public status?: number,
		public endpoint?: string,
		public errors?: Record<string, string[]>
	) {
		super(message)
		this.name = 'RushCMSError'
	}
}

async function fetchAPI<T>(
	endpoint: string,
	options: FetchAPIOptions = {}
): Promise<T> {
	const { revalidate = REVALIDATE_TIME, tags = [] } = options

	if (!API_URL || !API_TOKEN) {
		throw new RushCMSError(
			'Missing API configuration. Check NEXT_PUBLIC_API_URL and API_TOKEN environment variables.',
			undefined,
			endpoint
		)
	}

	try {
		const res = await fetch(`${API_URL}${endpoint}`, {
			headers: {
				'Authorization': `Bearer ${API_TOKEN}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-Site-ID': SITE_ID
			},
			next: {
				revalidate,
				tags
			}
		})

		if (!res.ok) {
			const errorData = await res.json().catch(() => null) as RushCMSErrorResponse | null

			throw new RushCMSError(
				errorData?.message || `API Error: ${res.statusText}`,
				res.status,
				endpoint,
				errorData?.errors
			)
		}

		return res.json()
	} catch (error) {
		if (error instanceof RushCMSError) {
			throw error
		}

		throw new RushCMSError(
			`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
			undefined,
			endpoint
		)
	}
}

export async function getTeams(): Promise<RushCMSSite[]> {
	const response = await fetchAPI<RushCMSResponse<RushCMSSite[]>>('/api/v1/teams', {
		tags: ['teams']
	})

	return response.data
}

export async function getSiteName(siteSlug: string, fallback: string): Promise<string> {
	try {
		const teams = await getTeams()
		const currentTeam = teams.find(team => team.slug === siteSlug)
		return currentTeam?.name || fallback
	} catch (error) {
		return fallback
	}
}

export async function getCollections(siteSlug: string): Promise<RushCMSCollection[]> {
	const response = await fetchAPI<RushCMSResponse<RushCMSCollection[]>>(
		`/api/v1/${siteSlug}/collections`,
		{
			revalidate: 3600,
			tags: ['collections']
		}
	)

	return response.data
}

export async function getCollection(
	siteSlug: string,
	collectionSlug: string
): Promise<RushCMSCollection> {
	const response = await fetchAPI<RushCMSResponse<RushCMSCollection>>(
		`/api/v1/${siteSlug}/collections/${collectionSlug}`,
		{
			revalidate: 3600,
			tags: [`collection-${collectionSlug}`]
		}
	)

	return response.data
}

export async function getEntries<T = Record<string, unknown>>(
	siteSlug: string,
	collectionId: number,
	params?: GetEntriesParams
): Promise<RushCMSEntry<T>[]> {
	const searchParams = new URLSearchParams()

	if (params?.status) searchParams.set('status', params.status)
	if (params?.per_page) searchParams.set('per_page', params.per_page.toString())
	if (params?.page) searchParams.set('page', params.page.toString())
	if (params?.category) searchParams.set('category', params.category)
	if (params?.tag) searchParams.set('tag', params.tag)
	if (params?.search) searchParams.set('search', params.search)
	if (params?.sort) searchParams.set('sort', params.sort)
	if (params?.order) searchParams.set('order', params.order)

	const queryString = searchParams.toString()
	const endpoint = `/api/v1/${siteSlug}/collections/${collectionId}/entries${queryString ? `?${queryString}` : ''}`

	const response = await fetchAPI<RushCMSResponse<RushCMSEntry<T>[]>>(endpoint, {
		tags: ['entries-list', `collection-${collectionId}-entries`]
	})

	return response.data
}

export async function getEntryBySlug<T = Record<string, unknown>>(
	siteSlug: string,
	entrySlug: string,
	collection?: string
): Promise<RushCMSEntry<T>> {
	const params = new URLSearchParams()
	if (collection) params.set('collection', collection)

	const queryString = params.toString()
	const endpoint = `/api/v1/${siteSlug}/entries/slug/${entrySlug}${queryString ? `?${queryString}` : ''}`

	const response = await fetchAPI<RushCMSResponse<RushCMSEntry<T>>>(endpoint, {
		tags: [`entry-${entrySlug}`]
	})

	return response.data
}

export async function getNavigations(siteSlug: string): Promise<RushCMSNavigation[]> {
	const response = await fetchAPI<RushCMSResponse<RushCMSNavigation[]>>(
		`/api/v1/${siteSlug}/navigations`,
		{
			revalidate: 3600,
			tags: ['navigations']
		}
	)

	return response.data
}

export async function getNavigationItems(
	siteSlug: string,
	navigationId: number
): Promise<RushCMSNavigationItem[]> {
	const response = await fetchAPI<RushCMSResponse<RushCMSNavigationItem[]>>(
		`/api/v1/${siteSlug}/navigations/${navigationId}/items`,
		{
			revalidate: 3600,
			tags: [`navigation-${navigationId}-items`]
		}
	)

	return response.data
}

export async function getForms(siteSlug: string): Promise<RushCMSForm[]> {
	const response = await fetchAPI<RushCMSResponse<RushCMSForm[]>>(
		`/api/v1/${siteSlug}/forms`,
		{
			revalidate: 3600,
			tags: ['forms']
		}
	)

	return response.data
}

export async function getForm(siteSlug: string, formKey: string): Promise<RushCMSForm> {
	const response = await fetchAPI<RushCMSResponse<RushCMSForm>>(
		`/api/v1/${siteSlug}/forms/${formKey}`,
		{
			revalidate: 3600,
			tags: [`form-${formKey}`]
		}
	)

	return response.data
}

export function getAnalyticsScriptUrl(siteSlug: string): string {
	if (!API_URL) {
		throw new Error('NEXT_PUBLIC_API_URL is not configured')
	}

	return `${API_URL}/api/v1/${siteSlug}/analytics.js`
}

export { RushCMSError as RushCMSAPIError }
