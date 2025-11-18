import { describe, it, expect } from 'vitest'
import { sanitizeHTML } from './sanitize'

describe('sanitizeHTML', () => {
	it('should allow safe HTML tags', () => {
		const html = '<p>Hello <strong>World</strong></p>'
		const result = sanitizeHTML(html)
		expect(result).toContain('<p>')
		expect(result).toContain('<strong>')
		expect(result).toContain('Hello')
		expect(result).toContain('World')
	})

	it('should remove script tags', () => {
		const html = '<p>Hello</p><script>alert("XSS")</script>'
		const result = sanitizeHTML(html)
		expect(result).not.toContain('<script>')
		expect(result).not.toContain('alert')
		expect(result).toContain('<p>')
		expect(result).toContain('Hello')
	})

	it('should remove event handlers', () => {
		const html = '<p onclick="alert()">Click</p>'
		const result = sanitizeHTML(html)
		expect(result).not.toContain('onclick')
		expect(result).toContain('Click')
	})

	it('should allow safe attributes', () => {
		const html = '<a href="/test" target="_blank">Link</a>'
		const result = sanitizeHTML(html)
		expect(result).toContain('href')
		expect(result).toContain('target')
		expect(result).toContain('Link')
	})

	it('should handle empty string', () => {
		const result = sanitizeHTML('')
		expect(result).toBe('')
	})

	it('should handle plain text without HTML', () => {
		const text = 'Just plain text'
		const result = sanitizeHTML(text)
		expect(result).toBe(text)
	})

	it('should remove dangerous iframe tags', () => {
		const html = '<p>Safe</p><iframe src="evil.com"></iframe>'
		const result = sanitizeHTML(html)
		expect(result).not.toContain('<iframe>')
		expect(result).not.toContain('evil.com')
		expect(result).toContain('Safe')
	})

	it('should allow img tags with safe attributes', () => {
		const html = '<img src="/image.jpg" alt="Test" />'
		const result = sanitizeHTML(html)
		expect(result).toContain('<img')
		expect(result).toContain('src')
		expect(result).toContain('alt')
	})

	it('should remove javascript: protocol from links', () => {
		const html = '<a href="javascript:alert()">Click</a>'
		const result = sanitizeHTML(html)
		expect(result).not.toContain('javascript:')
	})

	it('should handle nested tags', () => {
		const html = '<div><p><strong><em>Nested</em></strong></p></div>'
		const result = sanitizeHTML(html)
		expect(result).toContain('<div>')
		expect(result).toContain('<p>')
		expect(result).toContain('<strong>')
		expect(result).toContain('<em>')
		expect(result).toContain('Nested')
	})
})
