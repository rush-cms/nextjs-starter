'use client'

import { useState } from 'react'
import type { BlockRendererProps } from './types'
import type { CodeBlockData } from '@/types/rush-cms'

export function CodeBlock({ data }: BlockRendererProps) {
	const blockData = data as CodeBlockData['data']
	const [copied, setCopied] = useState(false)

	if (!blockData.code) {
		return null
	}

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(blockData.code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy code:', err)
		}
	}

	return (
		<div className='my-6 relative group'>
			<div className='flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg'>
				<span className='text-sm text-gray-400 font-mono'>
					{blockData.language || 'code'}
				</span>
				<button
					onClick={handleCopy}
					className='text-gray-400 hover:text-white text-sm flex items-center gap-2'
					aria-label='Copy code'
				>
					{copied ? (
						<>
							<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
								<path
									fillRule='evenodd'
									d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
									clipRule='evenodd'
								/>
							</svg>
							Copied!
						</>
					) : (
						<>
							<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
								<path d='M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' />
								<path d='M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z' />
							</svg>
							Copy
						</>
					)}
				</button>
			</div>
			<pre className='bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto'>
				<code className='font-mono text-sm'>{blockData.code}</code>
			</pre>
		</div>
	)
}
