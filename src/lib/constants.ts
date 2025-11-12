export const IMAGE_SIZES = {
	FULL_WIDTH: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px',
	GRID_4_COL: '(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw',
	GRID_3_COL: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw',
	HERO: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px',
	THUMBNAIL: '(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw'
}

export const RATE_LIMIT = {
	MAX_REQUESTS: 10,
	WINDOW_MS: 60000
}

export const CACHE_TIMES = {
	NAVIGATION: 3600,
	ENTRIES: 1800,
	FORMS: 3600
}
