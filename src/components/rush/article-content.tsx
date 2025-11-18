'use client'

import { useMemo } from 'react'
import { TableOfContents, type TocHeading } from '@/components/toc/table-of-contents'

interface ArticleContentProps {
	content: string
	showToc?: boolean
}

export function ArticleContent({ content, showToc = true }: ArticleContentProps) {
	const { headings, processedContent } = useMemo(() => {
		const parser = new DOMParser()
		const doc = parser.parseFromString(content, 'text/html')
		const elements = doc.querySelectorAll('h2, h3')
		const extractedHeadings: TocHeading[] = []

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

			extractedHeadings.push({
				id,
				text,
				level
			})
		})

		return {
			headings: extractedHeadings,
			processedContent: doc.body.innerHTML
		}
	}, [content])

	if (!showToc || headings.length === 0) {
		return (
			<div
				className='prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg prose-img:shadow-md'
				dangerouslySetInnerHTML={{ __html: processedContent }}
			/>
		)
	}

	return (
		<div className='lg:grid lg:grid-cols-12 lg:gap-8'>
			<div className='lg:col-span-8'>
				<div
					className='prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-24 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg prose-img:shadow-md'
					dangerouslySetInnerHTML={{ __html: processedContent }}
				/>
			</div>

			<aside className='lg:col-span-4 mt-8 lg:mt-0'>
				<TableOfContents headings={headings} />
			</aside>
		</div>
	)
}
