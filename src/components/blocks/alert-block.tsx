import type { BlockRendererProps } from './types'
import type { AlertBlockData } from '@/types/rush-cms'

const alertStyles = {
	info: {
		container: 'bg-blue-50 border-blue-400 text-blue-900',
		icon: '🔵'
	},
	warning: {
		container: 'bg-yellow-50 border-yellow-400 text-yellow-900',
		icon: '⚠️'
	},
	success: {
		container: 'bg-green-50 border-green-400 text-green-900',
		icon: '✓'
	},
	error: {
		container: 'bg-red-50 border-red-400 text-red-900',
		icon: '✕'
	}
}

export function AlertBlock({ data }: BlockRendererProps) {
	const blockData = data as AlertBlockData['data']

	if (!blockData.content) {
		return null
	}

	const type = blockData.type || 'info'
	const styles = alertStyles[type]

	return (
		<div className={`my-6 border-l-4 ${styles.container} p-4 rounded-r-lg shadow-sm`}>
			<div className='flex items-center gap-3'>
				<span className='text-2xl flex-shrink-0'>{styles.icon}</span>
				<div className='flex-1 font-medium'>
					{blockData.content}
				</div>
			</div>
		</div>
	)
}
