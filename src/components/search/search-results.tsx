'use client'

import { LuCircleAlert } from 'react-icons/lu'

interface SearchResultsProps {
	query: string
	totalResults: number
	children: React.ReactNode
}

export function SearchResults({ query, totalResults, children }: SearchResultsProps) {
	if (!query) {
		return <>{children}</>
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between pb-4 border-b border-gray-200'>
				<p className='text-sm text-gray-600'>
					{totalResults > 0 ? (
						<>
							Found <span className='font-semibold text-gray-900'>{totalResults}</span> result
							{totalResults !== 1 ? 's' : ''} for{' '}
							<span className='font-semibold text-gray-900'>&quot;{query}&quot;</span>
						</>
					) : (
						<span className='flex items-center gap-2 text-gray-600'>
							<LuCircleAlert className='w-4 h-4' />
							No results found for{' '}
							<span className='font-semibold text-gray-900'>&quot;{query}&quot;</span>
						</span>
					)}
				</p>
			</div>

			{totalResults > 0 ? (
				children
			) : (
				<div className='text-center py-12 sm:py-16'>
					<p className='text-lg text-gray-600 mb-2'>No articles match your search</p>
					<p className='text-sm text-gray-500'>
						Try different keywords or check your spelling
					</p>
				</div>
			)}
		</div>
	)
}
