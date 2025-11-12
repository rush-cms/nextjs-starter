import { http, HttpResponse } from 'msw'

export const handlers = [
	http.get('https://api.test.com/api/v1/sites/test/navigation/1', () => {
		return HttpResponse.json({
			data: {
				id: 1,
				items: [
					{ id: 1, label: 'Home', url: '/', order: 1 },
					{ id: 2, label: 'Blog', url: '/blog', order: 2 }
				]
			}
		})
	}),

	http.get('https://api.test.com/api/v1/sites/test/collections/1/entries', () => {
		return HttpResponse.json({
			data: [
				{
					id: 1,
					slug: 'test-post',
					data: {
						title: 'Test Post',
						excerpt: 'Test excerpt',
						content: '<p>Test content</p>'
					},
					created_at: '2025-01-01T00:00:00Z'
				}
			],
			meta: {
				current_page: 1,
				last_page: 1,
				per_page: 10,
				total: 1
			}
		})
	}),

	http.get('https://api.test.com/api/v1/sites/test/collections/1/entries/test-post', () => {
		return HttpResponse.json({
			data: {
				id: 1,
				slug: 'test-post',
				data: {
					title: 'Test Post',
					excerpt: 'Test excerpt',
					content: '<p>Test content</p>',
					published: true
				},
				created_at: '2025-01-01T00:00:00Z'
			}
		})
	}),

	http.post('https://api.test.com/api/v1/sites/test/forms/contact/submit', () => {
		return HttpResponse.json({
			success: true,
			message: 'Form submitted successfully'
		})
	})
]
