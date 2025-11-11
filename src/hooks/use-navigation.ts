'use client'

import { useState, useEffect } from 'react'
import type { RushCMSNavigation, RushCMSNavigationItem } from '@/types/rush-cms'

interface UseNavigationOptions {
	siteSlug: string
	navigationId?: number
	enabled?: boolean
}

interface UseNavigationReturn {
	navigations: RushCMSNavigation[] | null
	items: RushCMSNavigationItem[] | null
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
}

export function useNavigation(
	options: UseNavigationOptions
): UseNavigationReturn {
	const { siteSlug, navigationId, enabled = true } = options

	const [navigations, setNavigations] = useState<RushCMSNavigation[] | null>(null)
	const [items, setItems] = useState<RushCMSNavigationItem[] | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchNavigation = async () => {
		if (!enabled) {
			setLoading(false)
			return
		}

		setLoading(true)
		setError(null)

		try {
			if (navigationId) {
				const url = `/api/rush-cms/navigation/${siteSlug}/${navigationId}/items`
				const response = await fetch(url)

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}

				const data = await response.json()
				setItems(data.data)
			} else {
				const url = `/api/rush-cms/navigation/${siteSlug}`
				const response = await fetch(url)

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}

				const data = await response.json()
				setNavigations(data.data)
			}
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error occurred'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchNavigation()
	}, [siteSlug, navigationId, enabled])

	return {
		navigations,
		items,
		loading,
		error,
		refetch: fetchNavigation
	}
}
