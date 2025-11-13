import type { BlockRendererProps } from './types'
import type { DividerBlockData } from '@/types/rush-cms'

const dividerStyles = {
	solid: 'border-t-2 border-gray-300',
	dashed: 'border-t-2 border-dashed border-gray-300',
	dotted: 'border-t-2 border-dotted border-gray-300',
	double: 'border-t-4 border-double border-gray-300'
}

export function DividerBlock({ data }: BlockRendererProps) {
	const blockData = data as DividerBlockData['data']
	const style = blockData.style || 'solid'

	return (
		<hr className={`my-8 ${dividerStyles[style]}`} />
	)
}
