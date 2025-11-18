import { describe, it, expect } from 'vitest'
import { IMAGE_SIZES, RATE_LIMIT, CACHE_TIMES } from './constants'

describe('Constants', () => {
	describe('IMAGE_SIZES', () => {
		it('should define FULL_WIDTH size', () => {
			expect(IMAGE_SIZES.FULL_WIDTH).toBeDefined()
			expect(IMAGE_SIZES.FULL_WIDTH).toContain('100vw')
		})

		it('should define GRID_4_COL size', () => {
			expect(IMAGE_SIZES.GRID_4_COL).toBeDefined()
			expect(IMAGE_SIZES.GRID_4_COL).toContain('50vw')
		})

		it('should define GRID_3_COL size', () => {
			expect(IMAGE_SIZES.GRID_3_COL).toBeDefined()
			expect(IMAGE_SIZES.GRID_3_COL).toContain('100vw')
		})

		it('should define HERO size', () => {
			expect(IMAGE_SIZES.HERO).toBeDefined()
			expect(IMAGE_SIZES.HERO).toContain('100vw')
		})

		it('should define THUMBNAIL size', () => {
			expect(IMAGE_SIZES.THUMBNAIL).toBeDefined()
			expect(IMAGE_SIZES.THUMBNAIL).toContain('25vw')
		})
	})

	describe('RATE_LIMIT', () => {
		it('should define MAX_REQUESTS', () => {
			expect(RATE_LIMIT.MAX_REQUESTS).toBe(10)
		})

		it('should define WINDOW_MS', () => {
			expect(RATE_LIMIT.WINDOW_MS).toBe(60000)
		})
	})

	describe('CACHE_TIMES', () => {
		it('should define NAVIGATION cache time', () => {
			expect(CACHE_TIMES.NAVIGATION).toBe(3600)
		})

		it('should define ENTRIES cache time', () => {
			expect(CACHE_TIMES.ENTRIES).toBe(1800)
		})

		it('should define FORMS cache time', () => {
			expect(CACHE_TIMES.FORMS).toBe(3600)
		})
	})
})
