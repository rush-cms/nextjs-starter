'use client'

import { useState } from 'react'
import { Facebook, Twitter, Linkedin, Mail, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
	url: string
	title: string
	description?: string
	variant?: 'default' | 'compact'
	showLabels?: boolean
}

export function ShareButtons({
	url,
	title,
	description = '',
	variant = 'default',
	showLabels = true
}: ShareButtonsProps) {
	const [copied, setCopied] = useState(false)

	const encodedUrl = encodeURIComponent(url)
	const encodedTitle = encodeURIComponent(title)
	const encodedDescription = encodeURIComponent(description)

	const shareLinks = {
		twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
		whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
		email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
	}

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(url)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (error) {
			console.error('Failed to copy link:', error)
		}
	}

	const handleNativeShare = async () => {
		if (typeof navigator !== 'undefined' && navigator.share) {
			try {
				await navigator.share({
					title,
					text: description,
					url
				})
			} catch (error) {
				if ((error as Error).name !== 'AbortError') {
					console.error('Error sharing:', error)
				}
			}
		}
	}

	const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share !== 'undefined'

	const buttonBaseClass = variant === 'compact'
		? 'p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
		: 'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

	const iconSize = variant === 'compact' ? 'w-5 h-5' : 'w-5 h-5'

	return (
		<div className='flex flex-wrap items-center gap-2'>
			{showLabels && variant === 'default' && (
				<span className='text-sm font-medium text-gray-700 mr-2'>
					Share:
				</span>
			)}

			{/* Twitter */}
			<a
				href={shareLinks.twitter}
				target='_blank'
				rel='noopener noreferrer'
				className={`${buttonBaseClass} text-white bg-[#1DA1F2] hover:bg-[#1a8cd8] focus:ring-[#1DA1F2]`}
				aria-label='Share on Twitter'
			>
				<Twitter className={iconSize} />
				{showLabels && variant === 'default' && <span>Twitter</span>}
			</a>

			{/* Facebook */}
			<a
				href={shareLinks.facebook}
				target='_blank'
				rel='noopener noreferrer'
				className={`${buttonBaseClass} text-white bg-[#1877F2] hover:bg-[#166fe5] focus:ring-[#1877F2]`}
				aria-label='Share on Facebook'
			>
				<Facebook className={iconSize} />
				{showLabels && variant === 'default' && <span>Facebook</span>}
			</a>

			{/* LinkedIn */}
			<a
				href={shareLinks.linkedin}
				target='_blank'
				rel='noopener noreferrer'
				className={`${buttonBaseClass} text-white bg-[#0A66C2] hover:bg-[#095196] focus:ring-[#0A66C2]`}
				aria-label='Share on LinkedIn'
			>
				<Linkedin className={iconSize} />
				{showLabels && variant === 'default' && <span>LinkedIn</span>}
			</a>

			{/* Email */}
			<a
				href={shareLinks.email}
				className={`${buttonBaseClass} text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-600`}
				aria-label='Share via Email'
			>
				<Mail className={iconSize} />
				{showLabels && variant === 'default' && <span>Email</span>}
			</a>

			{/* Copy Link */}
			<button
				onClick={handleCopyLink}
				className={`${buttonBaseClass} text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 ${
					copied ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''
				}`}
				aria-label='Copy link'
			>
				{copied ? (
					<>
						<Check className={iconSize} />
						{showLabels && variant === 'default' && <span>Copied!</span>}
					</>
				) : (
					<>
						<Link2 className={iconSize} />
						{showLabels && variant === 'default' && <span>Copy Link</span>}
					</>
				)}
			</button>

			{/* Native Share (mobile) */}
			{hasNativeShare && (
				<button
					onClick={handleNativeShare}
					className={`${buttonBaseClass} text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 lg:hidden`}
					aria-label='Share'
				>
					<svg
						className={iconSize}
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
						/>
					</svg>
					{showLabels && variant === 'default' && <span>Share</span>}
				</button>
			)}
		</div>
	)
}
