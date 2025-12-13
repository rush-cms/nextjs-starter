import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLinkPage } from '@/lib/rush-cms'
import { LinkPageRenderer } from '@/components/link-page/link-page-renderer'
import { config } from '@/lib/config'
import { logger } from '@/lib/logger'

export async function generateMetadata(): Promise<Metadata> {
	if (!config.linkPages.default) {
		return {
			title: 'LinkPage não configurada'
		}
	}

	try {
		const linkPage = await getLinkPage(config.site.slug, config.linkPages.default)

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
		logger.error('Failed to generate metadata for default linkpage', { error })
		return {
			title: 'LinkPage não encontrada'
		}
	}
}

export default async function LinksPage() {
	if (!config.linkPages.default) {
		logger.warn('LINKPAGE_KEY not configured in environment variables')
		notFound()
	}

	let linkPage

	try {
		linkPage = await getLinkPage(config.site.slug, config.linkPages.default)
	} catch (error) {
		logger.error('Failed to fetch default linkpage', { error })
		notFound()
	}

	return <LinkPageRenderer linkPage={linkPage} />
}
