import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { config } from '@/lib/config'

interface RevalidateRequestBody {
	secret?: string
	path?: string
	tag?: string
}

function secureCompare(a: string, b: string): boolean {
	if (a.length !== b.length) return false

	const bufA = Buffer.from(a, 'utf8')
	const bufB = Buffer.from(b, 'utf8')

	return timingSafeEqual(bufA, bufB)
}

export async function POST(request: NextRequest) {
	try {
		const body: RevalidateRequestBody = await request.json()

		if (!config.api.revalidateSecret) {
			console.error('[Revalidate] REVALIDATE_SECRET not configured')
			return NextResponse.json(
				{ success: false, message: 'Service not configured' },
				{ status: 503 }
			)
		}

		if (!body.secret || !secureCompare(body.secret, config.api.revalidateSecret)) {
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
			if (typeof body.path !== 'string' || body.path.length === 0 || body.path.length > 2048) {
				return NextResponse.json(
					{ success: false, message: 'Invalid path format' },
					{ status: 400 }
				)
			}

			if (!body.path.startsWith('/')) {
				return NextResponse.json(
					{ success: false, message: 'Path must start with /' },
					{ status: 400 }
				)
			}

			console.log('[Revalidate] Revalidating path:', body.path)
			revalidatePath(body.path, 'page')
		}

		if (body.tag) {
			if (typeof body.tag !== 'string' || body.tag.length === 0 || body.tag.length > 255) {
				return NextResponse.json(
					{ success: false, message: 'Invalid tag format' },
					{ status: 400 }
				)
			}

			if (!/^[a-zA-Z0-9_-]+$/.test(body.tag)) {
				return NextResponse.json(
					{ success: false, message: 'Tag contains invalid characters' },
					{ status: 400 }
				)
			}

			console.log('[Revalidate] Revalidating tag:', body.tag)
			revalidateTag(body.tag, 'max')
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
