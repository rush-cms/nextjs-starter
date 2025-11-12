import { forwardRef, type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'bordered' | 'elevated'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className = '', variant = 'default', ...props }, ref) => {
		const variantClasses = {
			default: 'bg-white',
			bordered: 'bg-white border border-gray-200',
			elevated: 'bg-white shadow-lg'
		}

		return (
			<div
				ref={ref}
				className={`rounded-lg ${variantClasses[variant]} ${className}`}
				{...props}
			/>
		)
	}
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className = '', ...props }, ref) => (
		<div
			ref={ref}
			className={`px-6 py-4 border-b border-gray-100 ${className}`}
			{...props}
		/>
	)
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
	({ className = '', ...props }, ref) => (
		<h3
			ref={ref}
			className={`text-lg font-semibold text-gray-900 ${className}`}
			{...props}
		/>
	)
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
	({ className = '', ...props }, ref) => (
		<p
			ref={ref}
			className={`text-sm text-gray-600 mt-1 ${className}`}
			{...props}
		/>
	)
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className = '', ...props }, ref) => (
		<div
			ref={ref}
			className={`px-6 py-4 ${className}`}
			{...props}
		/>
	)
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className = '', ...props }, ref) => (
		<div
			ref={ref}
			className={`px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg ${className}`}
			{...props}
		/>
	)
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
