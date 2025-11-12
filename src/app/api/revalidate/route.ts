import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

interface RevalidateRequestBody {
	secret?: string
	path?: string
	tag?: string
}

export async function POST(request: NextRequest) {
	try {
		const body: RevalidateRequestBody = await request.json()

		if (!body.secret || body.secret !== config.api.revalidateSecret) {
			console.error('[Revalidate] Invalid or missing secret')
			return NextResponse.json(
				{ success: false, message: 'Invalid secret' },
				{ status: 401 }
			)
		}

		if (!body.path && !body.tag) {
			console.error('[Revalidate] Missing path or tag parameter')
			return NextResponse.json(
				{ success: false, message: 'Missing path or tag parameter' },
				{ status: 400 }
			)
		}

		if (body.path) {
			console.log(`[Revalidate] Revalidating path: ${body.path}`)
			await revalidatePath(body.path, 'page')
		}

		if (body.tag) {
			console.log(`[Revalidate] Revalidating tag: ${body.tag}`)
			await revalidateTag(body.tag, 'page')
		}

		return NextResponse.json({
			success: true,
			message: 'Revalidation triggered successfully',
			revalidated: {
				path: body.path || null,
				tag: body.tag || null
			},
			timestamp: new Date().toISOString()
		})
	} catch (error) {
		console.error('[Revalidate] Error:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error',
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		)
	}
}

export async function GET() {
	return NextResponse.json(
		{
			success: false,
			message: 'Method not allowed. Use POST with JSON body.'
		},
		{ status: 405 }
	)
}
