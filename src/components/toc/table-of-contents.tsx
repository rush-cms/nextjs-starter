'use client'

import { useEffect, useState, useRef } from 'react'
import { LuChevronDown, LuChevronUp } from 'react-icons/lu'

export interface TocHeading {
	id: string
	text: string
	level: number
}

interface TableOfContentsProps {
	headings: TocHeading[]
	className?: string
}

export function TableOfContents({ headings, className = '' }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>('')
	const [isOpen, setIsOpen] = useState(false)
	const observerRef = useRef<IntersectionObserver | null>(null)

	useEffect(() => {
		const handleObserver = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveId(entry.target.id)
				}
			})
		}

		observerRef.current = new IntersectionObserver(handleObserver, {
			rootMargin: '-80px 0px -80% 0px',
			threshold: 0.5
		})

		headings.forEach((heading) => {
			const element = document.getElementById(heading.id)
			if (element && observerRef.current) {
				observerRef.current.observe(element)
			}
		})

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect()
			}
		}
	}, [headings])

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault()
		const element = document.getElementById(id)

		if (element) {
			const offset = 80
			const elementPosition = element.getBoundingClientRect().top
			const offsetPosition = elementPosition + window.pageYOffset - offset

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			})

			setActiveId(id)

			if (window.innerWidth < 1024) {
				setIsOpen(false)
			}
		}
	}

	if (headings.length === 0) {
		return null
	}

	return (
		<nav className={`toc ${className}`} aria-label='Table of contents'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='lg:hidden w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4'
				aria-expanded={isOpen}
			>
				<span className='font-semibold text-gray-900'>Table of Contents</span>
				{isOpen ? (
					<LuChevronUp className='w-5 h-5 text-gray-600' />
				) : (
					<LuChevronDown className='w-5 h-5 text-gray-600' />
				)}
			</button>

			<div
				className={`${isOpen ? 'block' : 'hidden'
					} lg:block lg:sticky lg:top-24 space-y-1`}
			>
				<div className='lg:p-4 lg:bg-gray-50 lg:rounded-lg lg:border lg:border-gray-200'>
					<h2 className='hidden lg:block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide'>
						On this page
					</h2>
					<ul className='space-y-2 text-sm'>
						{headings.map((heading) => {
							const isActive = activeId === heading.id
							const paddingLeft = heading.level === 2 ? 'pl-0' : 'pl-4'

							return (
								<li key={heading.id} className={paddingLeft}>
									<a
										href={`#${heading.id}`}
										onClick={(e) => handleClick(e, heading.id)}
										className={`block py-1 transition-colors ${isActive
											? 'text-blue-600 font-medium'
											: 'text-gray-600 hover:text-gray-900'
											}`}
										aria-current={isActive ? 'true' : undefined}
									>
										{heading.text}
									</a>
								</li>
							)
						})}
					</ul>
				</div>
			</div>
		</nav>
	)
}

export function extractHeadings(content: string): TocHeading[] {
	const headings: TocHeading[] = []
	const parser = new DOMParser()
	const doc = parser.parseFromString(content, 'text/html')
	const elements = doc.querySelectorAll('h2, h3')

	elements.forEach((element, index) => {
		const level = parseInt(element.tagName.substring(1))
		const text = element.textContent || ''

		let id = element.id

		if (!id) {
			id = text
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '')

			if (!id) {
				id = `heading-${index}`
			}

			element.id = id
		}

		headings.push({
			id,
			text,
			level
		})
	})

	return headings
}
