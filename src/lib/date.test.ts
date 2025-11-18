import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, getRelativeTimeData } from './date'

describe('Date Utils', () => {
	describe('formatDate', () => {
		it('should format date in pt-BR locale', () => {
			const result = formatDate('2025-01-15T12:00:00Z', 'pt-BR')
			expect(result).toContain('2025')
			expect(result).toContain('janeiro')
		})

		it('should format date in en locale', () => {
			const result = formatDate('2025-01-15T12:00:00Z', 'en')
			expect(result).toContain('2025')
			expect(result).toContain('January')
		})

		it('should use default pt-BR locale', () => {
			const result = formatDate('2025-01-15T12:00:00Z')
			expect(result).toContain('janeiro')
		})
	})

	describe('formatDateTime', () => {
		it('should format datetime in pt-BR locale', () => {
			const result = formatDateTime('2025-01-15T14:30:00Z', 'pt-BR')
			expect(result).toContain('2025')
			expect(result).toContain(':')
		})

		it('should format datetime in en locale', () => {
			const result = formatDateTime('2025-01-15T14:30:00Z', 'en')
			expect(result).toContain('2025')
		})
	})

	describe('getRelativeTimeData', () => {
		it('should return "now" for recent timestamps', () => {
			const now = new Date().toISOString()
			const result = getRelativeTimeData(now)
			expect(result.key).toBe('time.now')
			expect(result.value).toBeUndefined()
		})

		it('should return minutes ago for timestamps < 1 hour', () => {
			const past = new Date(Date.now() - 30 * 60 * 1000).toISOString()
			const result = getRelativeTimeData(past)
			expect(result.key).toBe('time.minutesAgo')
			expect(result.value).toBe(30)
		})

		it('should return hours ago for timestamps < 24 hours', () => {
			const past = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
			const result = getRelativeTimeData(past)
			expect(result.key).toBe('time.hoursAgo')
			expect(result.value).toBe(5)
		})

		it('should return days ago for timestamps < 1 week', () => {
			const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
			const result = getRelativeTimeData(past)
			expect(result.key).toBe('time.daysAgo')
			expect(result.value).toBe(3)
		})

		it('should return weeks ago for timestamps < 1 month', () => {
			const past = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
			const result = getRelativeTimeData(past)
			expect(result.key).toBe('time.weeksAgo')
			expect(result.value).toBe(2)
		})

		it('should return months ago for timestamps < 1 year', () => {
			const past = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
			const result = getRelativeTimeData(past)
			expect(result.key).toBe('time.monthsAgo')
			expect(result.value).toBe(2)
		})

		it('should return years ago for very old timestamps', () => {
			const past = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString()
			const result = getRelativeTimeData(past)
			expect(result.key).toBe('time.yearsAgo')
			expect(result.value).toBe(1)
		})
	})
})
