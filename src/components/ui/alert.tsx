'use client'

import { forwardRef, useState, type HTMLAttributes } from 'react'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'info' | 'success' | 'warning' | 'error'
	dismissible?: boolean
	onDismiss?: () => void
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
	({ className = '', variant = 'info', dismissible = false, onDismiss, children, ...props }, ref) => {
		const [isVisible, setIsVisible] = useState(true)

		const variantClasses = {
			info: 'bg-blue-50 border-blue-200 text-blue-900',
			success: 'bg-green-50 border-green-200 text-green-900',
			warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
			error: 'bg-red-50 border-red-200 text-red-900'
		}

		const iconClasses = {
			info: 'text-blue-500',
			success: 'text-green-500',
			warning: 'text-yellow-500',
			error: 'text-red-500'
		}

		const handleDismiss = () => {
			setIsVisible(false)
			onDismiss?.()
		}

		if (!isVisible) return null

		return (
			<div
				ref={ref}
				role='alert'
				className={`relative px-4 py-3 border rounded-lg ${variantClasses[variant]} ${className}`}
				{...props}
			>
				<div className='flex items-start gap-3'>
					<div className='flex-1'>{children}</div>
					{dismissible && (
						<button
							type='button'
							onClick={handleDismiss}
							className={`flex-shrink-0 ${iconClasses[variant]} hover:opacity-70 transition-opacity`}
							aria-label='Dismiss'
						>
							<svg
								className='w-5 h-5'
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path d='M6 18L18 6M6 6l12 12' />
							</svg>
						</button>
					)}
				</div>
			</div>
		)
	}
)
Alert.displayName = 'Alert'

const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
	({ className = '', ...props }, ref) => (
		<h5
			ref={ref}
			className={`font-medium mb-1 ${className}`}
			{...props}
		/>
	)
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
	({ className = '', ...props }, ref) => (
		<p
			ref={ref}
			className={`text-sm opacity-90 ${className}`}
			{...props}
		/>
	)
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
