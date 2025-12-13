import type {
	RushCMSResponse,
	RushCMSPaginatedResponse,
	RushCMSEntry,
	RushCMSCollection,
	RushCMSNavigation,
	RushCMSNavigationItem,
	RushCMSNavigationItemRaw,
	RushCMSForm,
	RushCMSSite,
	RushCMSTag,
	RushCMSLinkPage,
	GetEntriesParams,
	FetchAPIOptions,
	RushCMSError as RushCMSErrorType,
	RushCMSErrorResponse
} from '@/types/rush-cms'
import { rushcmsClient } from './rush-cms-sdk'
import { RushCMSError as SDKError } from '@rushcms/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_TOKEN = process.env.API_TOKEN
const SITE_SLUG = process.env.SITE_SLUG || 'default'
const REVALIDATE_TIME = parseInt(process.env.REVALIDATE_TIME || '1800')

export class RushCMSError extends SDKError {
	constructor(
		message: string,
		public status?: number,
		public endpoint?: string,
		public errors?: Record<string, string[]>
	) {
		super(message, status)
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
				'Accept': 'application/json'
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
	const collections = await getCollections(siteSlug)
	const collection = collections.find(c => c.slug === collectionSlug)

	if (!collection) {
		throw new RushCMSError(
			`Collection with slug '${collectionSlug}' not found`,
			404,
			`/api/v1/${siteSlug}/collections/${collectionSlug}`
		)
	}

	return collection
}

export async function getEntriesByCollection<T = Record<string, unknown>>(
	siteSlug: string,
	collectionSlug: string,
	params?: GetEntriesParams
): Promise<RushCMSEntry<T>[]> {
	const collection = await getCollection(siteSlug, collectionSlug)
	return getEntries<T>(siteSlug, collection.id, params)
}

export async function getEntryByCollectionAndSlug<T = Record<string, unknown>>(
	siteSlug: string,
	collectionSlug: string,
	entrySlug: string
): Promise<RushCMSEntry<T>> {
	const collection = await getCollection(siteSlug, collectionSlug)
	return getEntryBySlug<T>(siteSlug, entrySlug, collection.id)
}

export async function getEntries<T = Record<string, unknown>>(
	siteSlug: string,
	collectionId: number,
	params?: GetEntriesParams
): Promise<RushCMSEntry<T>[]> {
	try {
		const response = await rushcmsClient.getEntries(collectionId, {
			page: params?.page,
			per_page: params?.per_page,
			tags: params?.tag ? [params.tag] : undefined
		})

		return response.data as RushCMSEntry<T>[]
	} catch (error) {
		if (error instanceof SDKError) {
			throw new RushCMSError(
				error.message,
				error.statusCode,
				`/collections/${collectionId}/entries`
			)
		}
		throw error
	}
}

export async function getEntryBySlug<T = Record<string, unknown>>(
	siteSlug: string,
	entrySlug: string,
	collectionId: number
): Promise<RushCMSEntry<T>> {
	try {
		const entry = await rushcmsClient.getEntry(collectionId, entrySlug)
		return entry as RushCMSEntry<T>
	} catch (error) {
		if (error instanceof SDKError) {
			throw new RushCMSError(
				error.message,
				error.statusCode,
				`/collections/${collectionId}/entries/${entrySlug}`
			)
		}
		throw error
	}
}

function mapNavigationItems(items: RushCMSNavigationItemRaw[]): RushCMSNavigationItem[] {
	return items.map(item => ({
		id: parseInt(String(item.id)),
		parent_id: item.parent_id ? parseInt(String(item.parent_id)) : null,
		title: item.title,
		url: item.url || '#',
		target: item.target,
		order: item.order,
		children: item.children ? mapNavigationItems(item.children) : []
	}))
}

export async function getNavigations(siteSlug: string): Promise<RushCMSNavigation[]> {
	try {
		const response = await rushcmsClient.getNavigations()
		return response.data.map(nav => ({
			id: nav.id,
			name: nav.name,
			slug: nav.key,
			location: nav.key,
			items: mapNavigationItems(nav.items)
		}))
	} catch (error) {
		if (error instanceof SDKError) {
			throw new RushCMSError(
				error.message,
				error.statusCode,
				'/navigations'
			)
		}
		throw error
	}
}

export async function getNavigation(
	siteSlug: string,
	navigationKey: string
): Promise<RushCMSNavigation & { items: RushCMSNavigationItem[] }> {
	try {
		const response = await rushcmsClient.getNavigation(navigationKey)
		return {
			id: response.data.id,
			name: response.data.name,
			slug: response.data.key,
			location: response.data.key,
			items: mapNavigationItems(response.data.items)
		}
	} catch (error) {
		if (error instanceof SDKError) {
			throw new RushCMSError(
				error.message,
				error.statusCode,
				`/navigations/${navigationKey}`
			)
		}
		throw error
	}
}

export async function getNavigationItems(
	siteSlug: string,
	navigationKey: string
): Promise<RushCMSNavigationItem[]> {
	const navigation = await getNavigation(siteSlug, navigationKey)
	return navigation.items
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

export async function getTags(siteSlug: string): Promise<RushCMSTag[]> {
	const response = await fetchAPI<RushCMSResponse<RushCMSTag[]>>(
		`/api/v1/${siteSlug}/tags`,
		{
			revalidate: 3600,
			tags: ['tags']
		}
	)

	return response.data
}

export async function getEntriesByTag<T = Record<string, unknown>>(
	siteSlug: string,
	tagSlug: string
): Promise<RushCMSEntry<T>[]> {
	const response = await fetchAPI<RushCMSResponse<RushCMSEntry<T>[]>>(
		`/api/v1/${siteSlug}/tags/${tagSlug}/entries`,
		{
			tags: [`tag-${tagSlug}-entries`]
		}
	)

	return response.data
}

export async function getLinkPages(siteSlug: string): Promise<RushCMSLinkPage[]> {
	try {
		const response = await rushcmsClient.getLinkPages()
		return response.data as RushCMSLinkPage[]
	} catch (error) {
		if (error instanceof SDKError) {
			throw new RushCMSError(
				error.message,
				error.statusCode,
				'/linkpages'
			)
		}
		throw error
	}
}

export async function getLinkPage(siteSlug: string, key: string): Promise<RushCMSLinkPage> {
	try {
		const response = await rushcmsClient.getLinkPage(key)
		return response.data as RushCMSLinkPage
	} catch (error) {
		if (error instanceof SDKError) {
			throw new RushCMSError(
				error.message,
				error.statusCode,
				`/linkpages/${key}`
			)
		}
		throw error
	}
}

export function getAnalyticsScriptUrl(siteSlug: string): string {
	if (!API_URL) {
		throw new Error('NEXT_PUBLIC_API_URL is not configured')
	}

	return `${API_URL}/api/v1/${siteSlug}/analytics.js`
}

export { RushCMSError as RushCMSAPIError }
