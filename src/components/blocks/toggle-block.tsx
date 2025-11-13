'use client'

import { useState } from 'react'
import type { BlockRendererProps } from './types'
import type { ToggleBlockData } from '@/types/rush-cms'

export function ToggleBlock({ data }: BlockRendererProps) {
	const blockData = data as ToggleBlockData['data']
	const [isOpen, setIsOpen] = useState(false)

	if (!blockData.title || !blockData.content) {
		return null
	}

	return (
		<div className='my-4 border border-gray-200 rounded-lg overflow-hidden'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors'
				aria-expanded={isOpen}
			>
				<span className='font-medium text-left'>{blockData.title}</span>
				<svg
					className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M19 9l-7 7-7-7'
					/>
				</svg>
			</button>
			{isOpen && (
				<div className='px-4 py-3 bg-white border-t border-gray-200'>
					<div className='text-gray-700 leading-relaxed'>
						{blockData.content}
					</div>
				</div>
			)}
		</div>
	)
}
