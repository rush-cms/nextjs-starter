import { type HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'text' | 'circle' | 'rectangle' | 'card'
	width?: string
	height?: string
}

export function Skeleton({
	className = '',
	variant = 'rectangle',
	width,
	height,
	style,
	...props
}: SkeletonProps) {
	const variantClasses = {
		text: 'h-4 rounded',
		circle: 'rounded-full',
		rectangle: 'rounded-lg',
		card: 'rounded-xl'
	}

	const combinedStyle = {
		...style,
		...(width && { width }),
		...(height && { height })
	}

	return (
		<div
			className={`animate-pulse bg-gray-200 ${variantClasses[variant]} ${className}`}
			style={combinedStyle}
			{...props}
		/>
	)
}
