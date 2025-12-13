import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLinkPage } from '@/lib/rush-cms'
import { LinkPageRenderer } from '@/components/link-page/link-page-renderer'
import { config } from '@/lib/config'
import { logger } from '@/lib/logger'

interface PageProps {
	params: Promise<{
		key: string
	}>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { key } = await params

	try {
		const linkPage = await getLinkPage(config.site.slug, key)

		return {
			title: linkPage.title,
			description: linkPage.description || `Links de ${linkPage.title}`,
			openGraph: {
				title: linkPage.title,
				description: linkPage.description || undefined,
				images: linkPage.avatar ? [linkPage.avatar] : undefined
			}
		}
	} catch (error) {
		logger.error('Failed to generate metadata for linkpage', { key, error })
		return {
			title: 'LinkPage não encontrada'
		}
	}
}

export default async function LinkPagePage({ params }: PageProps) {
	const { key } = await params

	let linkPage

	try {
		linkPage = await getLinkPage(config.site.slug, key)
	} catch (error) {
		logger.error('Failed to fetch linkpage', { key, error })
		notFound()
	}

	return <LinkPageRenderer linkPage={linkPage} />
}
