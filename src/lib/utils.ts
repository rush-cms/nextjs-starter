import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getImageProps(
	image: string | { url: string, alt?: string } | undefined,
	fallbackAlt: string
): { url: string, alt: string } | null {
	if (!image) return null

	const url = typeof image === 'string' ? image : image.url
	const alt = typeof image === 'object' && image.alt ? image.alt : fallbackAlt

	return { url, alt }
}
