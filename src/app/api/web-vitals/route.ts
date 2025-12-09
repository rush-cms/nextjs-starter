import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		console.log('[Web Vitals]', body.name, body.value, body.rating)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error processing web vitals:', error)
		return NextResponse.json({ error: 'Failed to process metrics' }, { status: 500 })
	}
}
