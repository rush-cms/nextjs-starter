'use client'

import Image from 'next/image'
import type { RushCMSLinkPage } from '@/types/rush-cms'

interface LinkPageRendererProps {
	linkPage: RushCMSLinkPage
}

export function LinkPageRenderer({ linkPage }: LinkPageRendererProps) {
	const {
		title,
		description,
		avatar,
		links,
		social_links,
		settings
	} = linkPage

	const theme = settings?.theme || 'light'
	const buttonStyle = settings?.button_style || 'rounded'
	const showAvatar = settings?.show_avatar !== false
	const showDescription = settings?.show_description !== false

	const buttonClasses = {
		rounded: 'rounded-lg',
		square: 'rounded-none',
		pill: 'rounded-full'
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4'>
			<div className='max-w-2xl mx-auto'>
				<div className='bg-white rounded-2xl shadow-xl p-8 space-y-8'>
					{showAvatar && avatar && (
						<div className='flex justify-center'>
							<div className='relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100'>
								<Image
									src={avatar}
									alt={title}
									fill
									className='object-cover'
									sizes='96px'
								/>
							</div>
						</div>
					)}

					<div className='text-center space-y-2'>
						<h1 className='text-3xl font-bold text-gray-900'>
							{title}
						</h1>
						{showDescription && description && (
							<p className='text-gray-600 text-lg'>
								{description}
							</p>
						)}
					</div>

					{links && links.length > 0 && (
						<div className='space-y-3'>
							{links.map((link, index) => {
								const displayMode = link.display_mode || 'icon_text'
								const showIcon = displayMode !== 'text_only' && link.icon
								const showText = displayMode !== 'icon_only'

								return (
									<a
										key={index}
										href={link.url}
										target='_blank'
										rel='noopener noreferrer'
										className={`
											flex items-center justify-center gap-3 w-full
											px-6 py-4 ${buttonClasses[buttonStyle]}
											bg-gray-900 hover:bg-gray-800
											text-white font-medium
											transition-all duration-200
											hover:scale-105 hover:shadow-lg
											focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
										`}
									>
										{showIcon && (
											<span className='text-xl'>
												{link.icon}
											</span>
										)}
										{showText && (
											<span>{link.title}</span>
										)}
									</a>
								)
							})}
						</div>
					)}

					{social_links && social_links.length > 0 && (
						<div className='flex justify-center gap-4 pt-4'>
							{social_links.map((social, index) => (
								<a
									key={index}
									href={social.url}
									target='_blank'
									rel='noopener noreferrer'
									className='
										w-12 h-12 flex items-center justify-center
										rounded-full bg-gray-100 hover:bg-gray-200
										text-gray-700 hover:text-gray-900
										transition-all duration-200
										hover:scale-110
										focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
									'
									aria-label={social.platform}
								>
									{social.icon ? (
										<span className='text-xl'>{social.icon}</span>
									) : (
										<span className='text-sm font-medium'>
											{social.platform.substring(0, 2).toUpperCase()}
										</span>
									)}
								</a>
							))}
						</div>
					)}

					<div className='text-center pt-6'>
						<p className='text-sm text-gray-500'>
							Powered by{' '}
							<a
								href='https://rushcms.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-600 hover:text-blue-700 font-medium'
							>
								Rush CMS
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
