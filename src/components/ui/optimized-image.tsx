import Image, { type ImageProps } from 'next/image'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
	src: string
	alt: string
	width?: number
	height?: number
	aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | '21:9'
	objectFit?: 'cover' | 'contain' | 'fill' | 'none'
	priority?: boolean
	loading?: 'eager' | 'lazy'
	quality?: number
	placeholder?: 'blur' | 'empty'
	blurDataURL?: string
}

const ASPECT_RATIOS = {
	'square': 'aspect-square',
	'16:9': 'aspect-video',
	'4:3': 'aspect-[4/3]',
	'3:2': 'aspect-[3/2]',
	'21:9': 'aspect-[21/9]'
}

export function OptimizedImage({
	src,
	alt,
	width,
	height,
	aspectRatio,
	objectFit = 'cover',
	priority = false,
	loading = 'lazy',
	quality = 85,
	placeholder = 'empty',
	blurDataURL,
	className = '',
	sizes,
	...props
}: OptimizedImageProps) {
	const aspectClass = aspectRatio ? ASPECT_RATIOS[aspectRatio] : ''
	const objectFitClass = `object-${objectFit}`

	const defaultSizes =
		sizes ||
		'(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1200px'

	const imageProps: ImageProps = {
		src,
		alt,
		quality,
		priority,
		loading: priority ? 'eager' : loading,
		className: `${objectFitClass} ${className}`.trim(),
		sizes: defaultSizes,
		...props
	}

	if (placeholder === 'blur' && blurDataURL) {
		imageProps.placeholder = 'blur'
		imageProps.blurDataURL = blurDataURL
	}

	if (width && height) {
		return (
			<div className={`relative ${aspectClass}`.trim()}>
				<Image
					{...imageProps}
					width={width}
					height={height}
				/>
			</div>
		)
	}

	return (
		<div className={`relative ${aspectClass}`.trim()}>
			<Image
				{...imageProps}
				fill
			/>
		</div>
	)
}
