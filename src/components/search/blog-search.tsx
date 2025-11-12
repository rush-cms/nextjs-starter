'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SearchInput } from './search-input'
import { SearchResults } from './search-results'
import type { RushCMSEntry } from '@/types/rush-cms'

interface BlogSearchProps<T extends Record<string, unknown>> {
	entries: RushCMSEntry<T>[]
	children: (filteredEntries: RushCMSEntry<T>[]) => React.ReactNode
	searchFields?: (keyof T)[]
	placeholder?: string
}

export function BlogSearch<T extends Record<string, unknown>>({
	entries,
	children,
	searchFields = ['title' as keyof T, 'excerpt' as keyof T],
	placeholder = 'Search articles...'
}: BlogSearchProps<T>) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

	const filteredEntries = useMemo(() => {
		if (!searchQuery.trim()) {
			return entries
		}

		const query = searchQuery.toLowerCase().trim()

		return entries.filter((entry) => {
			return searchFields.some((field) => {
				const value = entry.data[field]

				if (typeof value === 'string') {
					return value.toLowerCase().includes(query)
				}

				if (Array.isArray(value)) {
					return value.some((item) => {
						if (typeof item === 'string') {
							return item.toLowerCase().includes(query)
						}
						if (typeof item === 'object' && item !== null && 'name' in item) {
							return String(item.name).toLowerCase().includes(query)
						}
						return false
					})
				}

				return false
			})
		})
	}, [entries, searchQuery, searchFields])

	const handleSearchChange = (value: string) => {
		setSearchQuery(value)

		const params = new URLSearchParams(searchParams.toString())

		if (value.trim()) {
			params.set('q', value)
			params.delete('page')
		} else {
			params.delete('q')
		}

		const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
		router.replace(newUrl, { scroll: false })
	}

	return (
		<div className='space-y-8'>
			<SearchInput
				value={searchQuery}
				onChange={handleSearchChange}
				placeholder={placeholder}
			/>

			<SearchResults query={searchQuery} totalResults={filteredEntries.length}>
				{children(filteredEntries)}
			</SearchResults>
		</div>
	)
}
