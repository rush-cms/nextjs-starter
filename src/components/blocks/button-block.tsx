import type { BlockRendererProps } from './types'
import type { ButtonBlockData } from '@/types/rush-cms'

const buttonVariants = {
	primary: 'bg-blue-600 hover:bg-blue-700 text-white',
	secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
	outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
	ghost: 'text-blue-600 hover:bg-blue-50'
}

const buttonSizes = {
	sm: 'px-4 py-2 text-sm',
	md: 'px-6 py-3 text-base',
	lg: 'px-8 py-4 text-lg'
}

export function ButtonBlock({ data }: BlockRendererProps) {
	const blockData = data as ButtonBlockData['data']

	if (!blockData.text || !blockData.url) {
		return null
	}

	const variant = blockData.variant || 'primary'
	const size = blockData.size || 'md'
	const sizeClass = buttonSizes[size as keyof typeof buttonSizes] || buttonSizes.md

	return (
		<div className='my-6'>
			<a
				href={blockData.url}
				target={blockData.openInNewTab ? '_blank' : undefined}
				rel={blockData.openInNewTab ? 'noopener noreferrer' : undefined}
				className={`inline-block font-medium rounded-lg transition-colors ${buttonVariants[variant]} ${sizeClass}`}
			>
				{blockData.text}
			</a>
		</div>
	)
}
