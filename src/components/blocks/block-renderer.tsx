'use client'

import { BlocksRenderer } from '@rushcms/react'
import type { Block } from '@rushcms/types'

interface BlockRendererProps {
	blocks?: Block[] | unknown
	className?: string
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
	if (!blocks) {
		return null
	}

	if (!Array.isArray(blocks)) {
		return null
	}

	if (blocks.length === 0) {
		return null
	}

	const validBlocks = blocks.filter((block): block is Block => {
		if (!block || typeof block !== 'object') {
			return false
		}

		const blockObj = block as { type?: unknown; data?: unknown }
		if (!blockObj.type || typeof blockObj.type !== 'string') {
			return false
		}

		if (!blockObj.data || typeof blockObj.data !== 'object') {
			return false
		}

		return true
	})

	if (validBlocks.length === 0) {
		return null
	}

	return <BlocksRenderer blocks={validBlocks} className={className} />
}
