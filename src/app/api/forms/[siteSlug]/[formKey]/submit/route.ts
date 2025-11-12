import { NextRequest, NextResponse } from 'next/server'
import type { RushCMSFormSubmission } from '@/types/rush-cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_TOKEN = process.env.API_TOKEN

interface RouteContext {
	params: Promise<{
		siteSlug: string
		formKey: string
	}>
}

export async function POST(
	request: NextRequest,
	context: RouteContext
) {
	const { siteSlug, formKey } = await context.params

	if (!API_URL || !API_TOKEN) {
		return NextResponse.json(
			{ success: false, message: 'API configuration missing' },
			{ status: 500 }
		)
	}

	try {
		const body = await request.json() as RushCMSFormSubmission

		const referrer = request.headers.get('referer')
		const userAgent = request.headers.get('user-agent')

		const metadata = {
			...body.metadata,
			referrer: referrer || undefined,
			user_agent: userAgent || undefined
		}

		const response = await fetch(
			`${API_URL}/api/v1/${siteSlug}/forms/${formKey}/submit`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${API_TOKEN}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					data: body.data,
					metadata
				})
			}
		)

		const data = await response.json()

		if (!response.ok) {
			return NextResponse.json(
				data,
				{ status: response.status }
			)
		}

		return NextResponse.json(data, { status: 201 })
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		)
	}
}
