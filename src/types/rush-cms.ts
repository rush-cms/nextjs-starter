export interface RushCMSAuthor {
	name: string
}

export interface RushCMSCollection {
	id: number
	name: string
	slug: string
	description?: string
	options: {
		main?: unknown[]
		sidebar?: unknown[]
	}
	metadata: Record<string, unknown>
	items_per_page: number
	entries_count?: number
}

export interface RushCMSImage {
	id: number
	url: string
	name: string
	size: number
	mime_type: string
	alt: string
	responsive?: {
		thumb?: string
		medium?: string
		large?: string
	}
}

export interface RushCMSCategory {
	id: number
	name: string
	slug: string
}

export interface RushCMSTag {
	id: number
	name: string
	slug: string
}

export interface RushCMSEntryMeta {
	seo_title?: string
	seo_description?: string
	seo_keywords?: string
	og_title?: string
	og_description?: string
	og_image?: string
	views?: number
	[key: string]: unknown
}

export type EntryStatus = 'published' | 'draft' | 'archived' | 'scheduled'

export interface RushCMSEntry<T = Record<string, unknown>> {
	id: number
	site_id?: number
	collection_id?: number
	author: RushCMSAuthor
	title: string
	slug: string
	excerpt: string
	data: T
	status: EntryStatus
	published_at: string
	expires_at?: string | null
	meta: RushCMSEntryMeta
	created_at: string
	updated_at: string
	collection?: RushCMSCollection
	tags?: RushCMSTag[]
}

export interface RushCMSPaginationMeta {
	current_page: number
	from: number
	last_page: number
	per_page: number
	to: number
	total: number
}

export interface RushCMSPaginationLinks {
	first: string
	last: string
	prev: string | null
	next: string | null
}

export interface RushCMSPaginatedResponse<T> {
	data: T[]
	meta: RushCMSPaginationMeta
	links: RushCMSPaginationLinks
}

export interface RushCMSResponse<T> {
	data: T
	message?: string
}

export interface RushCMSFormField {
	type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'file'
	config: {
		name: string
		label: string
		placeholder?: string
		options?: Array<{ value: string; label: string }>
		multiple?: boolean
	}
	validation: {
		is_required?: boolean
		min_length?: number
		max_length?: number
		pattern?: string
	}
}

export interface RushCMSForm {
	id: number
	name: string
	key: string
	description: string
	fields: RushCMSFormField[]
	is_active: boolean
	created_at: string
	updated_at: string
}

export interface RushCMSFormSubmission {
	data: Record<string, unknown>
	metadata?: Record<string, unknown>
}

export interface RushCMSFormSubmissionResponse {
	data: {
		submission_id: number
	}
	message: string
}

export interface RushCMSNavigationItem {
	id: number
	parent_id?: number | null
	title: string
	url: string
	target: '_self' | '_blank'
	order?: number
	children?: RushCMSNavigationItem[]
}

export interface RushCMSNavigation {
	id: number
	name: string
	slug: string
	location: string
	items?: RushCMSNavigationItem[]
}

export interface RushCMSSite {
	id: number
	name: string
	slug: string
	domain: string
	status: 'active' | 'inactive'
}

export interface RushCMSAnalyticsPageview {
	entry_slug: string
	collection_slug?: string
	session_id: string
	referrer?: string
	utm_source?: string
	utm_medium?: string
	utm_campaign?: string
}

export interface RushCMSErrorResponse {
	success: false
	message: string
	errors?: Record<string, string[]>
}

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

export interface GetEntriesParams {
	collection?: string
	status?: EntryStatus
	per_page?: number
	page?: number
	category?: string
	tag?: string
	search?: string
	sort?: 'created_at' | 'updated_at' | 'title' | 'published_at'
	order?: 'asc' | 'desc'
}

export interface FetchAPIOptions {
	revalidate?: number
	tags?: string[]
}

// Blog Entry Types
export interface BlogEntryData extends Record<string, unknown> {
	title: string
	excerpt?: string
	content?: string
	featured_image?: string | { url: string, alt?: string }
	category?: { name: string, slug: string }
	tags?: Array<{ name: string, slug: string }>
}

export type BlogEntry = RushCMSEntry<BlogEntryData>
export type AnyEntry = RushCMSEntry<Record<string, unknown>>

