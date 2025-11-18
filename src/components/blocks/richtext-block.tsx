import type { BlockRendererProps } from './types'
import type { RichTextBlockData } from '@/types/rush-cms'

interface TipTapNode {
	type: string
	content?: TipTapNode[]
	text?: string
	marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
	attrs?: Record<string, unknown>
}

function renderNode(node: TipTapNode, index: number): React.ReactNode {
	const { type, content, text, marks, attrs } = node

	if (type === 'text' && text) {
		let rendered: React.ReactNode = text

		if (marks && marks.length > 0) {
			marks.forEach((mark) => {
				switch (mark.type) {
					case 'bold':
						rendered = <strong key={`bold-${index}`}>{rendered}</strong>
						break
					case 'italic':
						rendered = <em key={`italic-${index}`}>{rendered}</em>
						break
					case 'code':
						rendered = <code key={`code-${index}`} className='bg-gray-100 px-1 py-0.5 rounded text-sm font-mono'>{rendered}</code>
						break
					case 'strike':
						rendered = <s key={`strike-${index}`}>{rendered}</s>
						break
					case 'underline':
						rendered = <u key={`underline-${index}`}>{rendered}</u>
						break
					case 'link':
						rendered = (
							<a
								key={`link-${index}`}
								href={mark.attrs?.href as string}
								target={mark.attrs?.target as string}
								rel='noopener noreferrer'
								className='text-blue-600 hover:text-blue-800 underline'
							>
								{rendered}
							</a>
						)
						break
				}
			})
		}

		return rendered
	}

	const children = content?.map((child, i) => renderNode(child, i))

	switch (type) {
		case 'paragraph':
			return <p key={index} className='mb-4'>{children}</p>

		case 'heading': {
			const level = (attrs?.level as number) || 2
			const headingClasses = {
				1: 'text-4xl font-bold mb-6 mt-8',
				2: 'text-3xl font-bold mb-5 mt-7',
				3: 'text-2xl font-bold mb-4 mt-6',
				4: 'text-xl font-bold mb-3 mt-5',
				5: 'text-lg font-bold mb-2 mt-4',
				6: 'text-base font-bold mb-2 mt-3'
			}
			const className = headingClasses[level as keyof typeof headingClasses]

			switch (level) {
				case 1: return <h1 key={index} className={className}>{children}</h1>
				case 2: return <h2 key={index} className={className}>{children}</h2>
				case 3: return <h3 key={index} className={className}>{children}</h3>
				case 4: return <h4 key={index} className={className}>{children}</h4>
				case 5: return <h5 key={index} className={className}>{children}</h5>
				case 6: return <h6 key={index} className={className}>{children}</h6>
				default: return <h2 key={index} className={className}>{children}</h2>
			}
		}

		case 'bulletList':
			return <ul key={index} className='list-disc list-inside mb-4 space-y-2'>{children}</ul>

		case 'orderedList':
			return <ol key={index} className='list-decimal list-inside mb-4 space-y-2'>{children}</ol>

		case 'listItem':
			return <li key={index}>{children}</li>

		case 'blockquote':
			return <blockquote key={index} className='border-l-4 border-gray-300 pl-4 italic my-4'>{children}</blockquote>

		case 'codeBlock':
			return (
				<pre key={index} className='bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4'>
					<code>{children}</code>
				</pre>
			)

		case 'horizontalRule':
			return <hr key={index} className='my-8 border-gray-300' />

		case 'hardBreak':
			return <br key={index} />

		default:
			return <div key={index}>{children}</div>
	}
}

export function RichTextBlock({ data }: BlockRendererProps) {
	const blockData = data as RichTextBlockData['data']

	if (!blockData.content) {
		return null
	}

	let tipTapContent

	try {
		const content = typeof blockData.content === 'string'
			? JSON.parse(blockData.content)
			: blockData.content

		if (!content || typeof content !== 'object') {
			return null
		}

		tipTapContent = content as { type: string; content?: TipTapNode[] }

		if (!tipTapContent.content || !Array.isArray(tipTapContent.content)) {
			return null
		}
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('[Rush CMS] Failed to parse richtext content:', error)
		}
		return null
	}

	return (
		<div className='prose prose-lg max-w-none'>
			{tipTapContent.content.map((node, index) => renderNode(node, index))}
		</div>
	)
}
