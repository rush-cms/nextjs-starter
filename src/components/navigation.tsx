'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { RushCMSNavigationItem } from '@/types/rush-cms'

interface NavigationProps {
	items: RushCMSNavigationItem[]
	siteName?: string
	className?: string
}

function NavigationItems({
	items,
	mobile = false,
	onItemClick
}: {
	items: RushCMSNavigationItem[]
	mobile?: boolean
	onItemClick?: () => void
}) {
	const pathname = usePathname()

	const isActive = (url: string) => {
		if (url === '/') {
			return pathname === '/'
		}
		return pathname.startsWith(url)
	}

	return (
		<ul className={mobile ? 'space-y-1' : 'flex items-center gap-2'}>
			{items.map((item, itemIndex) => {
				const active = isActive(item.url)
				const hasChildren = item.children && item.children.length > 0
				const itemKey = item.id ? `nav-${item.id}` : `nav-${item.url}-${itemIndex}`

				return (
					<li key={itemKey}>
						<Link
							href={item.url}
							target={item.target || '_self'}
							onClick={onItemClick}
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
								{item.children?.map((child, childIndex) => {
									const childActive = isActive(child.url)
									const childKey = child.id ? `nav-child-${child.id}` : `nav-child-${child.url}-${childIndex}`

									return (
										<li key={childKey} className='ml-4'>
											<Link
												href={child.url}
												target={child.target || '_self'}
												onClick={onItemClick}
												className={`
													block px-4 py-2 rounded-md transition-colors duration-200
													${mobile ? 'text-base' : 'text-sm'}
													${childActive
														? 'bg-blue-600 text-white font-medium'
														: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
													}
												`}
											>
												{child.title}
											</Link>
										</li>
									)
								})}
							</ul>
						)}
					</li>
				)
			})}
		</ul>
	)
}

export function Navigation({ items, siteName = 'Rush CMS', className = '' }: NavigationProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	if (!items || items.length === 0) {
		return null
	}

	return (
		<nav className={`bg-white border-b border-gray-200 ${className}`}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						<Link href='/' className='text-xl sm:text-2xl font-bold text-gray-900'>
							{siteName}
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
						<NavigationItems
							items={items}
							mobile
							onItemClick={() => setMobileMenuOpen(false)}
						/>
					</div>
				</div>
			)}
		</nav>
	)
}
