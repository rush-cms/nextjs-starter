// Suppress known Next.js 16 + React 19 development errors
// These are bugs in Next.js dev mode that don't affect production
// Remove this file when upgrading to Next.js 16.1+

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
	const originalError = console.error

	console.error = (...args: any[]) => {
		const errorMessage = args[0]?.toString() || ''

		// Suppress React 19 performance measurement error
		// https://github.com/vercel/next.js/issues/71638
		if (
			errorMessage.includes("cannot have a negative time stamp") ||
			errorMessage.includes("Failed to execute 'measure' on 'Performance'")
		) {
			return
		}

		originalError.apply(console, args)
	}
}
