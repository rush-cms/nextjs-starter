import { notFound } from 'next/navigation'
import { rushcmsClient } from '@/lib/rush-cms-sdk'
import type { Metadata } from 'next'
import type { LinkPage } from '@rushcms/types'
import { LinkPageRenderer } from '@/components/rush/link-page-renderer'

interface LinkPageProps {
	params: Promise<{
		key: string
	}>
}

export async function generateStaticParams() {
	try {
		const response = await rushcmsClient.getLinkPages()
		const linkPages = response.data

		return linkPages.map((linkPage) => ({
			key: linkPage.key
		}))
	} catch {
		return []
	}
}

export async function generateMetadata({ params }: LinkPageProps): Promise<Metadata> {
	const { key } = await params

	try {
		const response = await rushcmsClient.getLinkPage(key)
		const linkPage = response.data

		if (!linkPage) {
			return {
				title: 'LinkPage not found'
			}
		}

		return {
			title: linkPage.title,
			description: linkPage.description || linkPage.title,
			openGraph: {
				title: linkPage.title,
				description: linkPage.description || linkPage.title,
				type: 'profile',
				images: linkPage.avatar ? [linkPage.avatar] : []
			},
			twitter: {
				card: 'summary',
				title: linkPage.title,
				description: linkPage.description || linkPage.title,
				images: linkPage.avatar ? [linkPage.avatar] : []
			}
		}
	} catch {
		return {
			title: 'LinkPage not found'
		}
	}
}

export default async function LinkPagePage({ params }: LinkPageProps) {
	const { key } = await params

	let linkPage: LinkPage

	try {
		const response = await rushcmsClient.getLinkPage(key)
		linkPage = response.data
	} catch {
		notFound()
	}

	if (!linkPage) {
		notFound()
	}

	return <LinkPageRenderer linkPage={linkPage} />
}
