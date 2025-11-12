'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { RushCMSEntry } from '@/types/rush-cms'
import { sanitizeHTML } from '@/lib/sanitize'
import { IMAGE_SIZES } from '@/lib/constants'

interface EntryRendererProps {
	entry: RushCMSEntry<Record<string, unknown>>
	className?: string
}

interface FieldRendererProps {
	name: string
	value: unknown
}

function FieldRenderer({ name, value }: FieldRendererProps) {
	const t = useTranslations('boolean')
	if (value === null || value === undefined) {
		return null
	}

	if (typeof value === 'string') {
		if (value.startsWith('<')) {
			return (
				<div className='mb-4 sm:mb-6'>
					<div
						className='prose prose-sm sm:prose-base max-w-none'
						dangerouslySetInnerHTML={{ __html: sanitizeHTML(value) }}
					/>
				</div>
			)
		}

		if (value.startsWith('http') && /\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
			return (
				<div className='mb-4 sm:mb-6'>
					<div className='relative w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100'>
						<Image
							src={value}
							alt={name}
							fill
							className='object-cover'
							sizes={IMAGE_SIZES.FULL_WIDTH}
						/>
					</div>
				</div>
			)
		}

		return (
			<div className='mb-4 sm:mb-6'>
				<p className='text-sm sm:text-base text-gray-700 leading-relaxed'>{value}</p>
			</div>
		)
	}

	if (typeof value === 'boolean') {
		return (
			<div className='mb-4 sm:mb-6'>
				<span className={`inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
					value
						? 'bg-green-100 text-green-800'
						: 'bg-gray-100 text-gray-800'
				}`}>
					{value ? t('yes') : t('no')}
				</span>
			</div>
		)
	}

	if (typeof value === 'number') {
		return (
			<div className='mb-4 sm:mb-6'>
				<p className='text-sm sm:text-base text-gray-700 font-medium'>{value}</p>
			</div>
		)
	}

	if (typeof value === 'object') {
		if (Array.isArray(value)) {
			if (value.length === 0) {
				return null
			}

			if (typeof value[0] === 'string' && value[0].startsWith('http')) {
				return (
					<div className='mb-4 sm:mb-6'>
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
							{value.map((url, index) => (
								<div key={index} className='relative aspect-square rounded-lg overflow-hidden bg-gray-100'>
									<Image
										src={url}
										alt={`${name} ${index + 1}`}
										fill
										className='object-cover'
										sizes={IMAGE_SIZES.GRID_4_COL}
									/>
								</div>
							))}
						</div>
					</div>
				)
			}

			return (
				<div className='mb-4 sm:mb-6'>
					<ul className='space-y-2'>
						{value.map((item, index) => (
							<li key={index} className='text-sm sm:text-base text-gray-700 flex items-start gap-2'>
								<span className='text-blue-600 mt-1'>•</span>
								<span>{typeof item === 'object' ? item.name || JSON.stringify(item) : String(item)}</span>
							</li>
						))}
					</ul>
				</div>
			)
		}

		if ('url' in value && typeof value.url === 'string') {
			const imageObj = value as { url: string, alt?: string }
			return (
				<div className='mb-4 sm:mb-6'>
					<div className='relative w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100'>
						<Image
							src={imageObj.url}
							alt={imageObj.alt || name}
							fill
							className='object-cover'
							sizes={IMAGE_SIZES.FULL_WIDTH}
						/>
					</div>
				</div>
			)
		}

		if ('name' in value) {
			const nameObj = value as { name: string }
			return (
				<div className='mb-4 sm:mb-6'>
					<span className='inline-block px-3 py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded-full'>
						{nameObj.name}
					</span>
				</div>
			)
		}
	}

	return null
}

export function EntryRenderer({ entry, className = '' }: EntryRendererProps) {
	const fields = Object.entries(entry.data)

	const specialFields = ['title', 'content', 'excerpt', 'featured_image', 'category', 'tags']
	const customFields = fields.filter(([key]) => !specialFields.includes(key))

	const tags = entry.data.tags as Array<{ name: string } | string> | undefined
	const title = typeof entry.data.title === 'string' ? entry.data.title : null
	const excerpt = typeof entry.data.excerpt === 'string' ? entry.data.excerpt : null

	return (
		<div className={`w-full ${className}`}>
			{title && (
				<h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight'>
					{title}
				</h1>
			)}

			{excerpt && (
				<p className='text-base sm:text-lg text-gray-700 italic mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200'>
					{excerpt}
				</p>
			)}

			{entry.data.featured_image ? (
				<div className='mb-6 sm:mb-8 lg:mb-10'>
					<FieldRenderer name='featured_image' value={entry.data.featured_image} />
				</div>
			) : null}

			{entry.data.content ? (
				<div className='mb-6 sm:mb-8'>
					<FieldRenderer name='content' value={entry.data.content} />
				</div>
			) : null}

			{customFields.length > 0 && (
				<div className='space-y-4 sm:space-y-6 mt-6 sm:mt-8'>
					{customFields.map(([key, value]) => (
						<div key={key}>
							<FieldRenderer name={key} value={value} />
						</div>
					))}
				</div>
			)}

			{entry.data.category ? (
				<div className='mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200'>
					<FieldRenderer name='category' value={entry.data.category} />
				</div>
			) : null}

			{tags && tags.length > 0 && (
				<div className='flex flex-wrap gap-2 mt-4 sm:mt-6'>
					{tags.map((tag, index) => (
						<span
							key={index}
							className='px-3 py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-full'
						>
							#{typeof tag === 'object' && 'name' in tag ? tag.name : tag}
						</span>
					))}
				</div>
			)}
		</div>
	)
}
