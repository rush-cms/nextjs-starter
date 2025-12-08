import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'
import { logger } from '@/lib/logger'

interface RevalidateRequestBody {
	secret?: string
	path?: string
	tag?: string
}

const securityHeaders = {
	'Content-Type': 'application/json',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'X-XSS-Protection': '1; mode=block',
	'Referrer-Policy': 'strict-origin-when-cross-origin'
}

function secureCompare(a: string, b: string): boolean {
	if (a.length !== b.length) return false

	const encoder = new TextEncoder()
	const bufA = encoder.encode(a)
	const bufB = encoder.encode(b)

	let result = 0
	for (let i = 0; i < bufA.length; i++) {
		result |= bufA[i] ^ bufB[i]
	}

	return result === 0
}

const rateLimitMap = new Map<string, number[]>()

function isRateLimited(identifier: string, maxRequests: number, windowMs: number): boolean {
	const now = Date.now()
	const timestamps = rateLimitMap.get(identifier) || []

	const recentTimestamps = timestamps.filter(ts => now - ts < windowMs)

	if (recentTimestamps.length >= maxRequests) {
		return true
	}

	recentTimestamps.push(now)
	rateLimitMap.set(identifier, recentTimestamps)

	setTimeout(() => {
		const current = rateLimitMap.get(identifier) || []
		const filtered = current.filter(ts => Date.now() - ts < windowMs)
		if (filtered.length === 0) {
			rateLimitMap.delete(identifier)
		} else {
			rateLimitMap.set(identifier, filtered)
		}
	}, windowMs)

	return false
}

export async function POST(request: NextRequest) {
	const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
	                 request.headers.get('x-real-ip') ||
	                 'unknown'

	if (isRateLimited(clientIp, 10, 60000)) {
		return NextResponse.json(
			{ success: false, message: 'Too many requests. Please try again later.' },
			{ status: 429, headers: securityHeaders }
		)
	}
	try {
		const body: RevalidateRequestBody = await request.json()

		if (!config.api.revalidateSecret) {
			logger.error('revalidation secret not configured')
			return NextResponse.json(
				{ success: false, message: 'Service not configured' },
				{ status: 503, headers: securityHeaders }
			)
		}

		if (!body.secret || !secureCompare(body.secret, config.api.revalidateSecret)) {
			logger.warn('invalid revalidation secret attempt', { clientIp })
			return NextResponse.json(
				{ success: false, message: 'Invalid secret' },
				{ status: 401, headers: securityHeaders }
			)
		}

		if (!body.path && !body.tag) {
			logger.warn('missing path or tag parameter')
			return NextResponse.json(
				{ success: false, message: 'Missing path or tag parameter' },
				{ status: 400, headers: securityHeaders }
			)
		}

		if (body.path) {
			if (typeof body.path !== 'string' || body.path.length === 0 || body.path.length > 2048) {
				return NextResponse.json(
					{ success: false, message: 'Invalid path format' },
					{ status: 400, headers: securityHeaders }
				)
			}

			if (!body.path.startsWith('/')) {
				return NextResponse.json(
					{ success: false, message: 'Path must start with /' },
					{ status: 400, headers: securityHeaders }
				)
			}

			logger.info('revalidating path', { path: body.path })
			revalidatePath(body.path, 'page')
		}

		if (body.tag) {
			if (typeof body.tag !== 'string' || body.tag.length === 0 || body.tag.length > 255) {
				return NextResponse.json(
					{ success: false, message: 'Invalid tag format' },
					{ status: 400, headers: securityHeaders }
				)
			}

			if (!/^[a-zA-Z0-9_-]+$/.test(body.tag)) {
				return NextResponse.json(
					{ success: false, message: 'Tag contains invalid characters' },
					{ status: 400, headers: securityHeaders }
				)
			}

			logger.info('revalidating tag', { tag: body.tag })
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
		}, { headers: securityHeaders })
	} catch (error) {
		logger.error('revalidation failed', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined
		})
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error'
			},
			{ status: 500, headers: securityHeaders }
		)
	}
}

export async function GET() {
	return NextResponse.json(
		{
			success: false,
			message: 'Method not allowed. Use POST with JSON body.'
		},
		{ status: 405, headers: securityHeaders }
	)
}
