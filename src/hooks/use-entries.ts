'use client'

import { useState, useEffect } from 'react'
import type { RushCMSEntry, GetEntriesParams } from '@/types/rush-cms'

interface UseEntriesOptions {
	siteSlug: string
	collectionId: number
	params?: GetEntriesParams
	enabled?: boolean
}

interface UseEntriesReturn<T = Record<string, unknown>> {
	entries: RushCMSEntry<T>[] | null
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useEntries<T = Record<string, unknown>>(
	options: UseEntriesOptions
): UseEntriesReturn<T> {
	const { siteSlug, collectionId, params, enabled = true } = options

	const [entries, setEntries] = useState<RushCMSEntry<T>[] | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchEntries = async () => {
		if (!enabled) {
			setLoading(false)
			return
		}

		setLoading(true)
		setError(null)

		try {
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
			const url = `/api/rush-cms/entries/${siteSlug}/${collectionId}${queryString ? `?${queryString}` : ''}`

			const response = await fetch(url)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			setEntries(data.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error occurred'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchEntries()
	}, [siteSlug, collectionId, JSON.stringify(params), enabled])

	return {
		entries,
		loading,
		error,
		refetch: fetchEntries
	}
}
