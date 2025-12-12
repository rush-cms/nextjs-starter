'use client'

import Link from 'next/link'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

interface PaginationProps {
	currentPage: number
	totalPages: number
	baseUrl: string
	maxVisiblePages?: number
}

export function Pagination({
	currentPage,
	totalPages,
	baseUrl,
	maxVisiblePages = 5
}: PaginationProps) {
	if (totalPages <= 1) return null

	const getPageNumbers = (): (number | string)[] => {
		const pages: (number | string)[] = []
		const halfVisible = Math.floor(maxVisiblePages / 2)

		let startPage = Math.max(1, currentPage - halfVisible)
		let endPage = Math.min(totalPages, currentPage + halfVisible)

		if (currentPage <= halfVisible) {
			endPage = Math.min(maxVisiblePages, totalPages)
		}

		if (currentPage + halfVisible >= totalPages) {
			startPage = Math.max(1, totalPages - maxVisiblePages + 1)
		}

		if (startPage > 1) {
			pages.push(1)
			if (startPage > 2) {
				pages.push('...')
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i)
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push('...')
			}
			pages.push(totalPages)
		}

		return pages
	}

	const buildUrl = (page: number): string => {
		const url = new URL(baseUrl, 'http://localhost')
		url.searchParams.set('page', page.toString())
		return `${url.pathname}${url.search}`
	}

	const pages = getPageNumbers()

	return (
		<nav
			className='flex items-center justify-center gap-1 sm:gap-2'
			role='navigation'
			aria-label='Pagination'
		>
			{currentPage > 1 ? (
				<Link
					href={buildUrl(currentPage - 1)}
					className='flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
					aria-label='Previous page'
				>
					<LuChevronLeft className='w-4 h-4' />
					<span className='hidden sm:inline'>Previous</span>
				</Link>
			) : (
				<span
					className='flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed'
					aria-disabled='true'
				>
					<LuChevronLeft className='w-4 h-4' />
					<span className='hidden sm:inline'>Previous</span>
				</span>
			)}

			<div className='flex items-center gap-1'>
				{pages.map((page, index) => {
					if (page === '...') {
						return (
							<span
								key={`ellipsis-${index}`}
								className='px-2 py-2 text-sm text-gray-500'
								aria-hidden='true'
							>
								...
							</span>
						)
					}

					const pageNumber = page as number
					const isCurrentPage = pageNumber === currentPage

					return isCurrentPage ? (
						<span
							key={pageNumber}
							className='px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg'
							aria-current='page'
							aria-label={`Page ${pageNumber}, current page`}
						>
							{pageNumber}
						</span>
					) : (
						<Link
							key={pageNumber}
							href={buildUrl(pageNumber)}
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
							aria-label={`Go to page ${pageNumber}`}
						>
							{pageNumber}
						</Link>
					)
				})}
			</div>

			{currentPage < totalPages ? (
				<Link
					href={buildUrl(currentPage + 1)}
					className='flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
					aria-label='Next page'
				>
					<span className='hidden sm:inline'>Next</span>
					<LuChevronRight className='w-4 h-4' />
				</Link>
			) : (
				<span
					className='flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed'
					aria-disabled='true'
				>
					<span className='hidden sm:inline'>Next</span>
					<LuChevronRight className='w-4 h-4' />
				</span>
			)}
		</nav>
	)
}
