import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger } from '../logger'

describe('Logger', () => {
	let consoleErrorSpy: any
	let consoleWarnSpy: any
	let consoleLogSpy: any
	const originalEnv = process.env.NODE_ENV

	beforeEach(() => {
		process.env.NODE_ENV = 'development'
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
	})

	afterEach(() => {
		process.env.NODE_ENV = originalEnv
		vi.restoreAllMocks()
	})

	it('should log error messages', () => {
		logger.error('Test error', { detail: 'value' })
		expect(consoleErrorSpy).toHaveBeenCalled()
		const callArgs = consoleErrorSpy.mock.calls[0]
		expect(callArgs[0]).toContain('[ERROR]')
		expect(callArgs[1]).toContain('Test error')
	})

	it('should log warning messages', () => {
		logger.warn('Test warning', { detail: 'value' })
		expect(consoleWarnSpy).toHaveBeenCalled()
		const callArgs = consoleWarnSpy.mock.calls[0]
		expect(callArgs[0]).toContain('[WARN]')
		expect(callArgs[1]).toContain('Test warning')
	})

	it('should log info messages', () => {
		logger.info('Test info', { detail: 'value' })
		expect(consoleLogSpy).toHaveBeenCalled()
		const callArgs = consoleLogSpy.mock.calls[0]
		expect(callArgs[0]).toContain('[INFO]')
		expect(callArgs[0]).toContain('Test info')
	})

	it('should include timestamp in logs', () => {
		logger.error('Test')
		const callArgs = consoleErrorSpy.mock.calls[0]
		const timestamp = callArgs[0]
		expect(timestamp).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
	})

	it('should handle messages without context', () => {
		logger.error('Simple message')
		expect(consoleErrorSpy).toHaveBeenCalled()
	})

	it('should handle complex context objects', () => {
		const context = {
			user: { id: 1, name: 'Test' },
			action: 'login',
			nested: { deep: { value: 'test' } }
		}
		logger.info('Complex', context)
		expect(consoleLogSpy).toHaveBeenCalled()
	})
})
