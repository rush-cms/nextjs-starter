import Image from 'next/image'
import { sanitizeHTML } from '@/lib/sanitize'

interface Block {
	type: string
	data: Record<string, unknown>
}

interface BlockEditorRendererProps {
	blocks: Block[]
	className?: string
}

function YouTubeBlock({ data }: { data: Record<string, unknown> }) {
	const url = data.url as string

	if (!url) return null

	const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]

	if (!videoId) return null

	return (
		<div className='my-6 sm:my-8'>
			<div className='relative w-full pb-[56.25%] rounded-lg overflow-hidden bg-gray-100'>
				<iframe
					className='absolute top-0 left-0 w-full h-full'
					src={`https://www.youtube.com/embed/${videoId}`}
					title={data.title as string || 'YouTube video'}
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen
				/>
			</div>
			{(() => {
				const caption = typeof data.caption === 'string' ? data.caption : null
				return caption ? (
					<p className='mt-2 text-xs sm:text-sm text-gray-600 text-center italic'>
						{caption}
					</p>
				) : null
			})()}
		</div>
	)
}

function GalleryBlock({ data }: { data: Record<string, unknown> }) {
	const images = data.images as string[]

	if (!images || images.length === 0) return null

	return (
		<div className='my-6 sm:my-8'>
			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
				{images.map((url, index) => (
					<div key={index} className='relative aspect-square rounded-lg overflow-hidden bg-gray-100'>
						<Image
							src={url}
							alt={`Gallery image ${index + 1}`}
							fill
							className='object-cover hover:scale-105 transition-transform duration-300'
							sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw'
						/>
					</div>
				))}
			</div>
			{(() => {
				const caption = typeof data.caption === 'string' ? data.caption : null
				return caption ? (
					<p className='mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 text-center italic'>
						{caption}
					</p>
				) : null
			})()}
		</div>
	)
}

function QuoteBlock({ data }: { data: Record<string, unknown> }) {
	const text = data.text as string
	const author = data.author as string

	if (!text) return null

	return (
		<blockquote className='my-6 sm:my-8 px-4 sm:px-6 py-4 sm:py-5 border-l-4 border-blue-600 bg-blue-50 rounded-r-lg'>
			<p className='text-base sm:text-lg md:text-xl text-gray-800 italic leading-relaxed'>
				"{text}"
			</p>
			{author && (
				<cite className='block mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 not-italic font-medium'>
					— {author}
				</cite>
			)}
		</blockquote>
	)
}

function ImageBlock({ data }: { data: Record<string, unknown> }) {
	const url = data.url as string

	if (!url) return null

	return (
		<figure className='my-6 sm:my-8'>
			<div className='relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden bg-gray-100'>
				<Image
					src={url}
					alt={data.caption as string || 'Image'}
					fill
					className='object-cover'
					sizes='(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px'
				/>
			</div>
			{(() => {
				const caption = typeof data.caption === 'string' ? data.caption : null
				return caption ? (
					<figcaption className='mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 text-center italic'>
						{caption}
					</figcaption>
				) : null
			})()}
		</figure>
	)
}

function ParagraphBlock({ data }: { data: Record<string, unknown> }) {
	const text = data.text as string

	if (!text) return null

	return (
		<div
			className='my-4 sm:my-6 prose prose-sm sm:prose-base max-w-none'
			dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }}
		/>
	)
}

function HeadingBlock({ data }: { data: Record<string, unknown> }) {
	const text = data.text as string
	const level = (data.level as number) || 2

	if (!text) return null

	const sizeClasses: Record<number, string> = {
		1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
		2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
		3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
		4: 'text-base sm:text-lg md:text-xl',
		5: 'text-sm sm:text-base md:text-lg',
		6: 'text-sm sm:text-base'
	}

	const className = `font-bold text-gray-900 my-4 sm:my-6 leading-tight ${sizeClasses[level]}`

	switch (level) {
		case 1:
			return <h1 className={className}>{text}</h1>
		case 2:
			return <h2 className={className}>{text}</h2>
		case 3:
			return <h3 className={className}>{text}</h3>
		case 4:
			return <h4 className={className}>{text}</h4>
		case 5:
			return <h5 className={className}>{text}</h5>
		case 6:
			return <h6 className={className}>{text}</h6>
		default:
			return <h2 className={className}>{text}</h2>
	}
}

function ListBlock({ data }: { data: Record<string, unknown> }) {
	const items = data.items as string[]
	const style = data.style as string || 'unordered'

	if (!items || items.length === 0) return null

	const Tag = style === 'ordered' ? 'ol' : 'ul'

	return (
		<Tag className={`my-4 sm:my-6 space-y-2 ${style === 'ordered' ? 'list-decimal' : 'list-disc'} list-inside`}>
			{items.map((item, index) => (
				<li key={index} className='text-sm sm:text-base text-gray-700 leading-relaxed'>
					{item}
				</li>
			))}
		</Tag>
	)
}

function renderBlock(block: Block, index: number) {
	switch (block.type) {
		case 'youtube':
			return <YouTubeBlock key={index} data={block.data} />
		case 'gallery':
			return <GalleryBlock key={index} data={block.data} />
		case 'quote':
			return <QuoteBlock key={index} data={block.data} />
		case 'image':
			return <ImageBlock key={index} data={block.data} />
		case 'paragraph':
			return <ParagraphBlock key={index} data={block.data} />
		case 'heading':
			return <HeadingBlock key={index} data={block.data} />
		case 'list':
			return <ListBlock key={index} data={block.data} />
		default:
			return null
	}
}

export function BlockEditorRenderer({ blocks, className = '' }: BlockEditorRendererProps) {
	if (!blocks || blocks.length === 0) {
		return null
	}

	return (
		<div className={`w-full max-w-4xl mx-auto ${className}`}>
			{blocks.map((block, index) => renderBlock(block, index))}
		</div>
	)
}
