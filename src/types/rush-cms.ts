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
	name: string
	file_name: string
	mime_type: string
	size: number
	url: string
	thumb?: string
	preview?: string
	alt?: string
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
	featured_image?: RushCMSImage | null
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
	id?: number
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

// Block Types
export interface BaseBlockData {
	type: string
	data: Record<string, unknown>
}

export interface RichTextBlockData extends BaseBlockData {
	type: 'richtext'
	data: {
		content: unknown
	}
}

export interface ImageBlockData extends BaseBlockData {
	type: 'image'
	data: {
		image?: RushCMSImage
		caption?: string
		alt?: string
		alignment?: 'left' | 'center' | 'right'
	}
}

export interface GalleryBlockData extends BaseBlockData {
	type: 'gallery'
	data: {
		images: RushCMSImage[]
		columns?: number
		caption?: string
	}
}

export interface VideoBlockData extends BaseBlockData {
	type: 'video'
	data: {
		url: string
		caption?: string
		poster?: string
		autoplay?: boolean
	}
}

export interface YoutubeBlockData extends BaseBlockData {
	type: 'youtube'
	data: {
		url: string
		video_id?: string
		title?: string
		caption?: string
	}
}

export interface QuoteBlockData extends BaseBlockData {
	type: 'quote'
	data: {
		content: string
		author?: string
		cite?: string
	}
}

export interface CalloutBlockData extends BaseBlockData {
	type: 'callout'
	data: {
		content: string
		type?: 'info' | 'warning' | 'success' | 'error'
		title?: string
	}
}

export interface AlertBlockData extends BaseBlockData {
	type: 'alert'
	data: {
		content: string
		type: 'info' | 'warning' | 'error' | 'success'
		title?: string
	}
}

export interface CodeBlockData extends BaseBlockData {
	type: 'code'
	data: {
		code: string
		language?: string
		filename?: string
	}
}

export interface DividerBlockData extends BaseBlockData {
	type: 'divider'
	data: {
		style?: 'solid' | 'dashed' | 'dotted' | 'double'
	}
}

export interface ButtonBlockData extends BaseBlockData {
	type: 'button'
	data: {
		text: string
		url: string
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
		size?: 'sm' | 'md' | 'lg'
		target?: '_self' | '_blank'
		openInNewTab?: boolean
	}
}

export interface ColumnsBlockData extends BaseBlockData {
	type: 'columns'
	data: {
		columns: Array<{
			content: BaseBlockData[]
		}>
	}
}

export interface ToggleBlockData extends BaseBlockData {
	type: 'toggle'
	data: {
		title: string
		content: string
	}
}

export interface EmbedBlockData extends BaseBlockData {
	type: 'embed'
	data: {
		url: string
		html?: string
		title?: string
		caption?: string
		aspectRatio?: '16/9' | '4/3' | '1/1'
	}
}

export interface BookmarkBlockData extends BaseBlockData {
	type: 'bookmark'
	data: {
		url: string
		title?: string
		description?: string
		image?: string
	}
}

export interface ParagraphBlockData extends BaseBlockData {
	type: 'paragraph'
	data: {
		content: string
	}
}

export type BlockData =
	| RichTextBlockData
	| ImageBlockData
	| GalleryBlockData
	| VideoBlockData
	| YoutubeBlockData
	| QuoteBlockData
	| CalloutBlockData
	| AlertBlockData
	| CodeBlockData
	| DividerBlockData
	| ButtonBlockData
	| ColumnsBlockData
	| ToggleBlockData
	| EmbedBlockData
	| BookmarkBlockData
	| ParagraphBlockData
	| BaseBlockData

export interface BaseBlockProps {
	type: string
	data: Record<string, unknown>
}

// Blog Entry Types
export interface BlogEntryData extends Record<string, unknown> {
	content?: BlockData[]
	categories?: string[]
	tags?: string[]
}

export type BlogEntry = RushCMSEntry<BlogEntryData>
export type AnyEntry = RushCMSEntry<Record<string, unknown>>

