'use client'

import { useState, useEffect } from 'react'
import type { RushCMSCollection } from '@/types/rush-cms'

interface UseCollectionsOptions {
	siteSlug: string
	enabled?: boolean
}

interface UseCollectionsReturn {
	collections: RushCMSCollection[] | null
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useCollections(
	options: UseCollectionsOptions
): UseCollectionsReturn {
	const { siteSlug, enabled = true } = options

	const [collections, setCollections] = useState<RushCMSCollection[] | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchCollections = async () => {
		if (!enabled) {
			setLoading(false)
			return
		}

		setLoading(true)
		setError(null)

		try {
			const url = `/api/rush-cms/collections/${siteSlug}`

			const response = await fetch(url)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			setCollections(data.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error occurred'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCollections()
	}, [siteSlug, enabled])

	return {
		collections,
		loading,
		error,
		refetch: fetchCollections
	}
}
