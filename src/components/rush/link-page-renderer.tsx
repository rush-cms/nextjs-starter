'use client'

import type { LinkPage, LinkPageLink, LinkPageSocialLink } from '@rushcms/types'
import Image from 'next/image'
import {
	Link as LinkIcon,
	Globe,
	Mail,
	Phone,
	MapPin,
	ShoppingCart,
	Camera,
	Video,
	Music,
	BookOpen,
	Newspaper,
	GraduationCap,
	Briefcase,
	Heart,
	Star,
	Flame,
	Sparkles,
	MessageCircle,
	FileText,
	Calendar
} from 'lucide-react'
import {
	Instagram,
	Facebook,
	Twitter,
	Linkedin,
	Youtube,
	Github,
	MessageCircle as Discord,
	Send as Telegram,
	Music as Spotify
} from 'lucide-react'

interface LinkPageRendererProps {
	linkPage: LinkPage
}

const ICON_MAP = {
	'link': LinkIcon,
	'globe': Globe,
	'envelope': Mail,
	'phone': Phone,
	'map-pin': MapPin,
	'shopping-cart': ShoppingCart,
	'camera': Camera,
	'video-camera': Video,
	'music-note': Music,
	'book-open': BookOpen,
	'newspaper': Newspaper,
	'academic-cap': GraduationCap,
	'briefcase': Briefcase,
	'heart': Heart,
	'star': Star,
	'fire': Flame,
	'sparkles': Sparkles,
	'chat-bubble': MessageCircle,
	'document': FileText,
	'calendar': Calendar
}

const SOCIAL_ICON_MAP = {
	'instagram': Instagram,
	'facebook': Facebook,
	'twitter': Twitter,
	'linkedin': Linkedin,
	'youtube': Youtube,
	'tiktok': Music,
	'github': Github,
	'discord': Discord,
	'whatsapp': Phone,
	'telegram': Telegram,
	'spotify': Spotify,
	'twitch': Video
}

export function LinkPageRenderer({ linkPage }: LinkPageRendererProps) {
	const backgroundColor = linkPage.settings.background_color || '#ffffff'
	const buttonColor = linkPage.settings.button_color || '#000000'
	const textColor = linkPage.settings.text_color || '#000000'

	return (
		<div
			className='min-h-screen flex flex-col items-center justify-center px-4 py-12'
			style={{ backgroundColor }}
		>
			<div className='w-full max-w-2xl mx-auto'>
				{linkPage.avatar && (
					<div className='flex justify-center mb-6'>
						<Image
							src={linkPage.avatar}
							alt={linkPage.title}
							width={96}
							height={96}
							className='rounded-full object-cover shadow-lg'
						/>
					</div>
				)}

				<div className='text-center mb-8'>
					<h1
						className='text-3xl font-bold mb-2'
						style={{ color: textColor }}
					>
						{linkPage.title}
					</h1>
					{linkPage.description && (
						<p
							className='text-lg opacity-80'
							style={{ color: textColor }}
						>
							{linkPage.description}
						</p>
					)}
				</div>

				{linkPage.links.length > 0 && (
					<div className='space-y-4 mb-8'>
						{linkPage.links.map((link, index) => (
							<LinkButton
								key={index}
								link={link}
								buttonColor={buttonColor}
							/>
						))}
					</div>
				)}

				{linkPage.social_links.length > 0 && (
					<div className='flex justify-center gap-4 flex-wrap'>
						{linkPage.social_links.map((socialLink, index) => (
							<SocialLinkButton
								key={index}
								socialLink={socialLink}
								buttonColor={buttonColor}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

interface LinkButtonProps {
	link: LinkPageLink
	buttonColor: string
}

function LinkButton({ link, buttonColor }: LinkButtonProps) {
	const Icon = link.icon ? ICON_MAP[link.icon] : null
	const showIcon = link.display_mode === 'icon' || link.display_mode === 'icon_text'
	const showText = link.display_mode === 'text' || link.display_mode === 'icon_text'

	const contrastColor = getContrastColor(buttonColor)

	return (
		<a
			href={link.url}
			target='_blank'
			rel='noopener noreferrer'
			className='block w-full px-6 py-4 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg'
			style={{
				backgroundColor: buttonColor,
				color: contrastColor
			}}
		>
			<div className='flex items-center justify-center gap-3'>
				{showIcon && Icon && <Icon className='w-5 h-5' />}
				{showText && <span>{link.title}</span>}
			</div>
		</a>
	)
}

interface SocialLinkButtonProps {
	socialLink: LinkPageSocialLink
	buttonColor: string
}

function SocialLinkButton({ socialLink, buttonColor }: SocialLinkButtonProps) {
	const Icon = SOCIAL_ICON_MAP[socialLink.platform]
	const contrastColor = getContrastColor(buttonColor)

	if (!Icon) return null

	return (
		<a
			href={socialLink.url}
			target='_blank'
			rel='noopener noreferrer'
			className='p-3 rounded-full transition-all hover:scale-110 hover:shadow-lg'
			style={{
				backgroundColor: buttonColor,
				color: contrastColor
			}}
			aria-label={socialLink.platform}
		>
			<Icon className='w-6 h-6' />
		</a>
	)
}

function getContrastColor(hexColor: string): string {
	const hex = hexColor.replace('#', '')
	const r = parseInt(hex.substr(0, 2), 16)
	const g = parseInt(hex.substr(2, 2), 16)
	const b = parseInt(hex.substr(4, 2), 16)

	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

	return luminance > 0.5 ? '#000000' : '#ffffff'
}
