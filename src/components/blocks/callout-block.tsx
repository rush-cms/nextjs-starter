import type { BlockRendererProps } from './types'
import type { CalloutBlockData } from '@/types/rush-cms'

const calloutStyles = {
	info: {
		container: 'bg-blue-50 border-blue-400',
		icon: 'ℹ️',
		title: 'text-blue-900',
		content: 'text-blue-800'
	},
	warning: {
		container: 'bg-yellow-50 border-yellow-400',
		icon: '⚠️',
		title: 'text-yellow-900',
		content: 'text-yellow-800'
	},
	success: {
		container: 'bg-green-50 border-green-400',
		icon: '✓',
		title: 'text-green-900',
		content: 'text-green-800'
	},
	error: {
		container: 'bg-red-50 border-red-400',
		icon: '✕',
		title: 'text-red-900',
		content: 'text-red-800'
	}
}

export function CalloutBlock({ data }: BlockRendererProps) {
	const blockData = data as CalloutBlockData['data']

	if (!blockData.content) {
		return null
	}

	const type = blockData.type || 'info'
	const styles = calloutStyles[type]

	return (
		<div className={`my-6 border-l-4 ${styles.container} p-4 rounded-r-lg`}>
			<div className='flex items-start gap-3'>
				<span className='text-2xl flex-shrink-0'>{styles.icon}</span>
				<div className='flex-1'>
					{blockData.title && (
						<p className={`font-bold mb-2 ${styles.title}`}>
							{blockData.title}
						</p>
					)}
					<div className={`${styles.content} leading-relaxed`}>
						{blockData.content}
					</div>
				</div>
			</div>
		</div>
	)
}
