'use client'

import { useEffect } from 'react'
import type { BlockRendererProps } from './types'

export function UnknownBlock({ type, data }: BlockRendererProps) {
	useEffect(() => {
		console.warn(`[Rush CMS] Unknown block type: "${type}". Please add a renderer for this block.`)
	}, [type])

	if (process.env.NODE_ENV !== 'production') {
		return (
			<div className='my-4 border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded'>
				<div className='flex items-center gap-2'>
					<span className='text-2xl'> </span>
					<div>
						<p className='font-bold text-yellow-800'>Unknown block type</p>
						<p className='text-sm text-yellow-700'>
							Type: <code className='bg-yellow-100 px-1 rounded'>{type}</code>
						</p>
					</div>
				</div>
				<details className='mt-2'>
					<summary className='cursor-pointer text-sm text-yellow-700 hover:text-yellow-800'>
						View data
					</summary>
					<pre className='text-xs mt-2 overflow-auto bg-yellow-100 p-2 rounded max-h-48'>
						{JSON.stringify(data, null, 2)}
					</pre>
				</details>
			</div>
		)
	}

	return null
}
