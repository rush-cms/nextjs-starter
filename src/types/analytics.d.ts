declare global {
	interface Window {
		gtag?: (
			command: string,
			targetId: string,
			config?: Record<string, unknown>
		) => void
		plausible?: (
			event: string,
			options?: { props?: Record<string, unknown> }
		) => void
	}
}

export {}
