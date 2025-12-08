// ============================================================================
// RushCMS Types - Migrated to use @rushcms/types SDK
// ============================================================================
// This file now imports types from the official SDK and creates aliases
// for backward compatibility with existing code.
// ============================================================================

// Import SDK types
import type {
	Entry,
	Author,
	FeaturedImage,
	Tag,
	EntryMeta,
	Block,
	PaginatedResponse,
	PaginationMeta,
	PaginationLinks,
	RichTextBlock,
	CalloutBlock,
	ToggleBlock,
	QuoteBlock,
	ImageBlock,
	GalleryBlock,
	VideoBlock,
	YoutubeBlock,
	EmbedBlock,
	BookmarkBlock,
	AlertBlock,
	DividerBlock,
	CodeBlock,
	ColumnsBlock,
	ButtonBlock
} from '@rushcms/types'

// ============================================================================
// Type Aliases for Backward Compatibility
// ============================================================================

// Core Types
export type RushCMSAuthor = Author
export type RushCMSImage = FeaturedImage
export type RushCMSTag = Tag
export type RushCMSEntryMeta = EntryMeta
export type RushCMSEntry<T = Record<string, unknown>> = Entry & { data: T }
export type RushCMSPaginationMeta = PaginationMeta
export type RushCMSPaginationLinks = PaginationLinks
export type RushCMSPaginatedResponse<T> = PaginatedResponse<T>

// Block Types - Using SDK types
export type BaseBlockData = Block
export type RichTextBlockData = RichTextBlock
export type CalloutBlockData = CalloutBlock
export type ToggleBlockData = ToggleBlock
export type QuoteBlockData = QuoteBlock
export type ImageBlockData = ImageBlock
export type GalleryBlockData = GalleryBlock
export type VideoBlockData = VideoBlock
export type YoutubeBlockData = YoutubeBlock
export type EmbedBlockData = EmbedBlock
export type BookmarkBlockData = BookmarkBlock
export type AlertBlockData = AlertBlock
export type DividerBlockData = DividerBlock
export type CodeBlockData = CodeBlock
export type ColumnsBlockData = ColumnsBlock
export type ButtonBlockData = ButtonBlock
export type BlockData = Block

// ============================================================================
// Custom Types (Not in SDK)
// ============================================================================

export type EntryStatus = 'published' | 'draft' | 'archived' | 'scheduled'

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

export interface RushCMSCategory {
	id: number
	name: string
	slug: string
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

export type LinkDisplayMode = 'icon_text' | 'icon_only' | 'text_only'

export interface RushCMSLinkPageLink {
	title: string
	url: string
	icon?: string
	display_mode?: LinkDisplayMode
}

export interface RushCMSLinkPageSocialLink {
	platform: string
	url: string
	icon?: string
}

export interface RushCMSLinkPageSettings {
	theme?: 'light' | 'dark' | 'auto'
	background_color?: string
	text_color?: string
	button_style?: 'rounded' | 'square' | 'pill'
	show_avatar?: boolean
	show_description?: boolean
}

export interface RushCMSLinkPage {
	id: number
	key: string
	title: string
	description?: string
	avatar?: string
	links: RushCMSLinkPageLink[]
	social_links: RushCMSLinkPageSocialLink[]
	settings: RushCMSLinkPageSettings
}

// ============================================================================
// Error Class (Using SDK errors)
// ============================================================================

import {
	RushCMSError as SDKError,
	RushCMSNotFoundError,
	RushCMSUnauthorizedError,
	RushCMSForbiddenError
} from '@rushcms/client'

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

export {
	RushCMSNotFoundError,
	RushCMSUnauthorizedError,
	RushCMSForbiddenError
}

// ============================================================================
// Props Types
// ============================================================================

export interface BaseBlockProps {
	type: string
	data: Record<string, unknown>
}

// ============================================================================
// Blog Entry Types
// ============================================================================

export interface BlogEntryData extends Record<string, unknown> {
	content?: Block[]
	categories?: string[]
	tags?: string[]
}

export type BlogEntry = RushCMSEntry<BlogEntryData>
export type AnyEntry = RushCMSEntry<Record<string, unknown>>
