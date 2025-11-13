'use client'

import { EntryCard } from '@/components/entry-card'
import { BlogSearch } from '@/components/search/blog-search'
import { Pagination } from '@/components/pagination/pagination'
import { formatDate } from '@/lib/date'
import type { RushCMSEntry, BlogEntryData } from '@/types/rush-cms'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface BlogListingProps {
	entries: RushCMSEntry<BlogEntryData>[]
	itemsPerPage?: number
}

export function BlogListing({ entries, itemsPerPage = 9 }: BlogListingProps) {
	const searchParams = useSearchParams()
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(() => {
		const page = Number(searchParams.get('page')) || 1
		setCurrentPage(page)
	}, [searchParams])

	return (
		<BlogSearch<BlogEntryData>
			entries={entries}
			searchFields={['title', 'excerpt', 'tags']}
			placeholder='Search articles by title, excerpt, or tags...'
		>
			{(filteredEntries) => {
				const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)
				const validPage = Math.min(Math.max(1, currentPage), totalPages || 1)
				const startIndex = (validPage - 1) * itemsPerPage
				const endIndex = startIndex + itemsPerPage
				const paginatedEntries = filteredEntries.slice(startIndex, endIndex)

				return (
					<>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
							{paginatedEntries.map((entry) => (
								<EntryCard
									key={entry.id}
									entry={entry}
									formatDate={formatDate}
								/>
							))}
						</div>

						{totalPages > 1 && (
							<div className='mt-12'>
								<Pagination
									currentPage={validPage}
									totalPages={totalPages}
									baseUrl='/blog'
								/>
							</div>
						)}
					</>
				)
			}}
		</BlogSearch>
	)
}
