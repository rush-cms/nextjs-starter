import { notFound } from 'next/navigation'
import { getEntryByCollectionAndSlug } from '@/lib/rush-cms'
import { EntryRenderer } from '@/components/rush/entry-renderer'
import { config } from '@/lib/config'
import type { RushCMSEntry } from '@/types/rush-cms'
import type { Metadata } from 'next'

interface DynamicPageProps {
	params: Promise<{
		slug: string
	}>
}

export async function generateStaticParams() {
	return []
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
	const { slug } = await params

	try {
		const entry = await getEntryByCollectionAndSlug(config.site.slug, 'pages', slug)

		if (!entry) {
			return {
				title: 'Página não encontrada'
			}
		}

		const title = typeof entry.data.title === 'string' ? entry.data.title : entry.title
		const description = typeof entry.data.excerpt === 'string' ? entry.data.excerpt : undefined

		return {
			title,
			description,
			openGraph: {
				title,
				description,
				type: 'website'
			}
		}
	} catch {
		return {
			title: 'Página não encontrada'
		}
	}
}

export default async function DynamicPage({ params }: DynamicPageProps) {
	const { slug } = await params

	try {
		const entry = await getEntryByCollectionAndSlug(config.site.slug, 'pages', slug)

		if (!entry) {
			notFound()
		}

		return (
			<div className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
				<EntryRenderer entry={entry} />
			</div>
		)
	} catch {
		notFound()
	}
}
