import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
	label: string
	href?: string
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[]
	showHome?: boolean
}

export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
	const allItems: BreadcrumbItem[] = showHome
		? [{ label: 'Home', href: '/' }, ...items]
		: items

	if (allItems.length === 0) {
		return null
	}

	return (
		<nav aria-label='Breadcrumb' className='mb-4 sm:mb-6'>
			<ol className='flex flex-wrap items-center gap-2 text-sm'>
				{allItems.map((item, index) => {
					const isLast = index === allItems.length - 1
					const isHome = showHome && index === 0

					return (
						<li key={index} className='flex items-center gap-2'>
							{index > 0 && (
								<ChevronRight className='w-4 h-4 text-gray-400' aria-hidden='true' />
							)}

							{isLast ? (
								<span
									className='text-gray-700 font-medium'
									aria-current='page'
								>
									{item.label}
								</span>
							) : item.href ? (
								<Link
									href={item.href}
									className='flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors'
								>
									{isHome && <Home className='w-4 h-4' />}
									<span>{item.label}</span>
								</Link>
							) : (
								<span className='text-gray-600'>{item.label}</span>
							)}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}
