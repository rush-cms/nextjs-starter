'use client'

import { useState, useEffect } from 'react'
import { FaFacebook, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { LuCheck, LuLink, LuMail, LuShare } from 'react-icons/lu'

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
	const [hasNativeShare, setHasNativeShare] = useState(false)

	useEffect(() => {
		// Use setTimeout to avoid synchronous state update warning
		const timer = setTimeout(() => {
			setHasNativeShare(typeof navigator !== 'undefined' && typeof navigator.share !== 'undefined')
		}, 0)
		return () => clearTimeout(timer)
	}, [])

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

			<a
				href={shareLinks.twitter}
				target='_blank'
				rel='noopener noreferrer'
				className={`${buttonBaseClass} text-white bg-black hover:bg-gray-800 focus:ring-black`}
				aria-label='Share on X'
			>
				<FaXTwitter className={iconSize} />
				{showLabels && variant === 'default' && <span>X</span>}
			</a>

			<a
				href={shareLinks.facebook}
				target='_blank'
				rel='noopener noreferrer'
				className={`${buttonBaseClass} text-white bg-[#1877F2] hover:bg-[#166fe5] focus:ring-[#1877F2]`}
				aria-label='Share on Facebook'
			>
				<FaFacebook className={iconSize} />
				{showLabels && variant === 'default' && <span>Facebook</span>}
			</a>

			<a
				href={shareLinks.linkedin}
				target='_blank'
				rel='noopener noreferrer'
				className={`${buttonBaseClass} text-white bg-[#0A66C2] hover:bg-[#095196] focus:ring-[#0A66C2]`}
				aria-label='Share on LinkedIn'
			>
				<FaLinkedin className={iconSize} />
				{showLabels && variant === 'default' && <span>LinkedIn</span>}
			</a>

			<a
				href={shareLinks.email}
				className={`${buttonBaseClass} text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-600`}
				aria-label='Share via Email'
			>
				<LuMail className={iconSize} />
				{showLabels && variant === 'default' && <span>Email</span>}
			</a>

			<button
				onClick={handleCopyLink}
				className={`${buttonBaseClass} text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 ${copied ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''
					}`}
				aria-label='Copy link'
			>
				{copied ? (
					<>
						<LuCheck className={iconSize} />
						{showLabels && variant === 'default' && <span>Copied!</span>}
					</>
				) : (
					<>
						<LuLink className={iconSize} />
						{showLabels && variant === 'default' && <span>Copy Link</span>}
					</>
				)}
			</button>

			{hasNativeShare && (
				<button
					onClick={handleNativeShare}
					className={`${buttonBaseClass} text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 lg:hidden`}
					aria-label='Share'
				>
					<LuShare className={iconSize} />
					{showLabels && variant === 'default' && <span>Share</span>}
				</button>
			)}
		</div>
	)
}
