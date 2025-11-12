'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { RushCMSNavigationItem } from '@/types/rush-cms'

interface NavigationProps {
	items: RushCMSNavigationItem[]
	className?: string
}

function NavigationItems({ items, mobile = false }: { items: RushCMSNavigationItem[], mobile?: boolean }) {
	const pathname = usePathname()

	const isActive = (url: string) => {
		if (url === '/') {
			return pathname === '/'
		}
		return pathname.startsWith(url)
	}

	const renderItem = (item: RushCMSNavigationItem, depth = 0) => {
		const active = isActive(item.url)
		const hasChildren = item.children && item.children.length > 0

		return (
			<li key={item.id} className={depth > 0 ? 'ml-4' : ''}>
				<Link
					href={item.url}
					target={item.target || '_self'}
					className={`
						block px-4 py-2 rounded-md transition-colors duration-200
						${mobile ? 'text-base' : 'text-sm'}
						${active
							? 'bg-blue-600 text-white font-medium'
							: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
						}
					`}
				>
					{item.title}
				</Link>
				{hasChildren && (
					<ul className='mt-1 space-y-1'>
						{item.children?.map(child => renderItem(child, depth + 1))}
					</ul>
				)}
			</li>
		)
	}

	return (
		<ul className={mobile ? 'space-y-1' : 'flex items-center gap-2'}>
			{items.map(item => renderItem(item))}
		</ul>
	)
}

export function Navigation({ items, className = '' }: NavigationProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<nav className={`bg-white border-b border-gray-200 ${className}`}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						<Link href='/' className='text-xl sm:text-2xl font-bold text-gray-900'>
							Rush CMS
						</Link>
					</div>

					<div className='hidden md:flex md:items-center md:gap-2'>
						<NavigationItems items={items} />
					</div>

					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className='md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600'
						aria-expanded={mobileMenuOpen}
						aria-label='Toggle navigation menu'
					>
						<svg
							className='h-6 w-6'
							stroke='currentColor'
							fill='none'
							viewBox='0 0 24 24'
						>
							{mobileMenuOpen ? (
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							) : (
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 6h16M4 12h16M4 18h16'
								/>
							)}
						</svg>
					</button>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className='md:hidden border-t border-gray-200'>
					<div className='px-2 pt-2 pb-3 space-y-1'>
						<NavigationItems items={items} mobile />
					</div>
				</div>
			)}
		</nav>
	)
}
