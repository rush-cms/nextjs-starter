'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { BlockRendererProps } from './types'
import type { GalleryBlockData } from '@/types/rush-cms'

export function GalleryBlock({ data }: BlockRendererProps) {
	const blockData = data as GalleryBlockData['data']
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

	if (!blockData.images || blockData.images.length === 0) {
		return null
	}

	const openLightbox = (index: number) => {
		setLightboxIndex(index)
	}

	const closeLightbox = () => {
		setLightboxIndex(null)
	}

	const nextImage = () => {
		if (lightboxIndex !== null) {
			setLightboxIndex((lightboxIndex + 1) % blockData.images.length)
		}
	}

	const prevImage = () => {
		if (lightboxIndex !== null) {
			setLightboxIndex(
				lightboxIndex === 0 ? blockData.images.length - 1 : lightboxIndex - 1
			)
		}
	}

	return (
		<>
			<div className='my-6'>
				<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
					{blockData.images.map((image, index) => (
						<button
							key={image.id}
							onClick={() => openLightbox(index)}
							className='relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity cursor-pointer'
						>
							<Image
								src={image.thumb || image.url}
								alt={image.alt || `Gallery image ${index + 1}`}
								fill
								className='object-cover'
								sizes='(max-width: 768px) 50vw, 33vw'
							/>
						</button>
					))}
				</div>
			</div>

			{lightboxIndex !== null && (
				<div
					className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center'
					onClick={closeLightbox}
				>
					<button
						onClick={closeLightbox}
						className='absolute top-4 right-4 text-white text-4xl hover:text-gray-300'
						aria-label='Close'
					>
						×
					</button>

					<button
						onClick={(e) => {
							e.stopPropagation()
							prevImage()
						}}
						className='absolute left-4 text-white text-4xl hover:text-gray-300'
						aria-label='Previous'
					>
						‹
					</button>

					<div
						className='max-w-5xl max-h-[90vh] relative'
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							src={blockData.images[lightboxIndex].url}
							alt={blockData.images[lightboxIndex].alt || `Image ${lightboxIndex + 1}`}
							width={1920}
							height={1080}
							className='max-w-full max-h-[90vh] w-auto h-auto'
							priority
						/>
						{blockData.images[lightboxIndex].alt && (
							<p className='text-white text-center mt-4'>
								{blockData.images[lightboxIndex].alt}
							</p>
						)}
					</div>

					<button
						onClick={(e) => {
							e.stopPropagation()
							nextImage()
						}}
						className='absolute right-4 text-white text-4xl hover:text-gray-300'
						aria-label='Next'
					>
						›
					</button>

					<div className='absolute bottom-4 left-0 right-0 text-center text-white'>
						{lightboxIndex + 1} / {blockData.images.length}
					</div>
				</div>
			)}
		</>
	)
}
