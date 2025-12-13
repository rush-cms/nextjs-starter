# Sprint #10 - Implement Comprehensive Testing (90% Coverage)

**Priority**: High
**Estimated Time**: 12-16 hours
**Status**: PENDING

## Objective
Implement comprehensive unit and integration tests achieving 90% code coverage across the entire Next.js Rush CMS starter project.

---

## Prerequisites
- Node.js 20+ installed
- pnpm 9+ installed
- Project dependencies installed (`pnpm install`)
- Basic understanding of Jest, React Testing Library, and MSW

---

## Phase 1: Testing Infrastructure Setup (2-3 hours)

### Task 1.1: Install Testing Dependencies
Install all required testing packages:

```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
pnpm add -D msw@latest
pnpm add -D @next/env
```

**Packages explanation:**
- `jest` - Test runner
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers for DOM
- `@testing-library/user-event` - User interaction simulation
- `jest-environment-jsdom` - DOM environment for tests
- `msw` (Mock Service Worker) - API mocking
- `@next/env` - Load Next.js environment variables in tests

### Task 1.2: Create Jest Configuration
Create `jest.config.ts` in project root:

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
	dir: './'
})

const config: Config = {
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.stories.{ts,tsx}',
		'!src/app/**/layout.tsx',
		'!src/app/**/loading.tsx',
		'!src/middleware.ts'
	],
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90
		}
	},
	testMatch: [
		'**/__tests__/**/*.[jt]s?(x)',
		'**/?(*.)+(spec|test).[jt]s?(x)'
	]
}

export default createJestConfig(config)
```

### Task 1.3: Create Jest Setup File
Create `jest.setup.ts` in project root:

```typescript
import '@testing-library/jest-dom'
import { loadEnvConfig } from '@next/env'

// Load environment variables
loadEnvConfig(process.cwd())

// Mock environment variables for tests
process.env.NEXT_PUBLIC_API_URL = 'https://api.test.com'
process.env.API_TOKEN = 'test-token-123'
process.env.SITE_ID = '1'
process.env.SITE_SLUG = 'test'
process.env.NEXT_PUBLIC_SITE_NAME = 'Test Site'
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.BLOG_COLLECTION_ID = '1'
process.env.PAGES_COLLECTION_ID = '2'
process.env.NAVIGATION_ID = '1'
process.env.CONTACT_FORM_KEY = 'contact'

// Mock next/navigation
jest.mock('next/navigation', () => ({
	useRouter: () => ({
		push: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn()
	}),
	useSearchParams: () => ({
		get: jest.fn()
	}),
	usePathname: () => '/',
	notFound: jest.fn()
}))

// Mock next-intl
jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
	useLocale: () => 'pt-BR'
}))

// Mock next-intl/server
jest.mock('next-intl/server', () => ({
	getTranslations: async () => (key: string) => key,
	getMessages: async () => ({}),
	unstable_setRequestLocale: jest.fn()
}))
```

### Task 1.4: Update package.json Scripts
Add test scripts to `package.json`:

```json
{
	"scripts": {
		"test": "jest",
		"test:watch": "jest --watch",
		"test:coverage": "jest --coverage",
		"test:ci": "jest --ci --coverage --maxWorkers=2"
	}
}
```

### Task 1.5: Setup MSW for API Mocking
Create `src/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
	// Mock navigation endpoint
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

	// Mock blog entries endpoint
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

	// Mock form submission
	http.post('https://api.test.com/api/v1/sites/test/forms/contact/submit', () => {
		return HttpResponse.json({
			success: true,
			message: 'Form submitted successfully'
		})
	})
]
```

Create `src/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

Update `jest.setup.ts` to include MSW:

```typescript
import { server } from '@/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Phase 2: Utility Functions Tests (2-3 hours)

### Task 2.1: Test `src/lib/config.ts`
Create `src/lib/__tests__/config.test.ts`:

```typescript
describe('Config', () => {
	it('should export valid configuration', () => {
		expect(config.site.id).toBe('1')
		expect(config.site.slug).toBe('test')
		expect(config.api.url).toBe('https://api.test.com')
	})

	it('should throw error if NEXT_PUBLIC_API_TOKEN is set', () => {
		const originalEnv = process.env.NEXT_PUBLIC_API_TOKEN
		process.env.NEXT_PUBLIC_API_TOKEN = 'leaked-token'

		expect(() => {
			jest.resetModules()
			require('../config')
		}).toThrow('SECURITY ERROR')

		process.env.NEXT_PUBLIC_API_TOKEN = originalEnv
	})

	it('should throw error if required env vars are missing', () => {
		const originalUrl = process.env.NEXT_PUBLIC_API_URL
		delete process.env.NEXT_PUBLIC_API_URL

		expect(() => {
			jest.resetModules()
			require('../config')
		}).toThrow('Missing required environment variables')

		process.env.NEXT_PUBLIC_API_URL = originalUrl
	})
})
```

### Task 2.2: Test `src/lib/date.ts`
Create `src/lib/__tests__/date.test.ts`:

```typescript
import { formatDate, formatDateTime, getRelativeTimeData } from '../date'

describe('Date Utils', () => {
	describe('formatDate', () => {
		it('should format date in pt-BR locale', () => {
			const result = formatDate('2025-01-15T12:00:00Z', 'pt-BR')
			expect(result).toContain('2025')
		})

		it('should format date in en locale', () => {
			const result = formatDate('2025-01-15T12:00:00Z', 'en')
			expect(result).toContain('2025')
		})
	})

	describe('getRelativeTimeData', () => {
		it('should return "now" for recent timestamps', () => {
			const now = new Date().toISOString()
			const result = getRelativeTimeData(now)
			expect(result.key).toBe('time.now')
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
	})
})
```

### Task 2.3: Test `src/lib/sanitize.ts`
Create `src/lib/__tests__/sanitize.test.ts`:

```typescript
import { sanitizeHTML } from '../sanitize'

describe('sanitizeHTML', () => {
	it('should allow safe HTML tags', () => {
		const html = '<p>Hello <strong>World</strong></p>'
		const result = sanitizeHTML(html)
		expect(result).toContain('<p>')
		expect(result).toContain('<strong>')
	})

	it('should remove script tags', () => {
		const html = '<p>Hello</p><script>alert("XSS")</script>'
		const result = sanitizeHTML(html)
		expect(result).not.toContain('<script>')
		expect(result).not.toContain('alert')
	})

	it('should remove event handlers', () => {
		const html = '<p onclick="alert()">Click</p>'
		const result = sanitizeHTML(html)
		expect(result).not.toContain('onclick')
	})

	it('should allow safe attributes', () => {
		const html = '<a href="/test" target="_blank">Link</a>'
		const result = sanitizeHTML(html)
		expect(result).toContain('href')
		expect(result).toContain('target')
	})
})
```

### Task 2.4: Test `src/lib/logger.ts`
Create `src/lib/__tests__/logger.test.ts`:

```typescript
import { logger } from '../logger'

describe('Logger', () => {
	let consoleErrorSpy: jest.SpyInstance
	let consoleWarnSpy: jest.SpyInstance
	let consoleInfoSpy: jest.SpyInstance

	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
		consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
		consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation()
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('should log error messages', () => {
		logger.error('Test error', { detail: 'value' })
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining('[ERROR]'),
			expect.stringContaining('Test error'),
			expect.objectContaining({ detail: 'value' })
		)
	})

	it('should log warning messages', () => {
		logger.warn('Test warning')
		expect(consoleWarnSpy).toHaveBeenCalled()
	})

	it('should log info messages', () => {
		logger.info('Test info')
		expect(consoleInfoSpy).toHaveBeenCalled()
	})
})
```

### Task 2.5: Test `src/lib/rush-cms.ts`
Create `src/lib/__tests__/rush-cms.test.ts`:

```typescript
import { getNavigationItems, getEntries, getEntryBySlug } from '../rush-cms'

describe('Rush CMS API', () => {
	describe('getNavigationItems', () => {
		it('should fetch navigation items', async () => {
			const items = await getNavigationItems('test', 1)
			expect(items).toHaveLength(2)
			expect(items[0].label).toBe('Home')
		})

		it('should handle API errors gracefully', async () => {
			server.use(
				http.get('https://api.test.com/api/v1/sites/*/navigation/*', () => {
					return HttpResponse.json({ error: 'Not found' }, { status: 404 })
				})
			)

			await expect(getNavigationItems('test', 999)).rejects.toThrow()
		})
	})

	describe('getEntries', () => {
		it('should fetch collection entries', async () => {
			const result = await getEntries('test', 1)
			expect(result.data).toHaveLength(1)
			expect(result.data[0].slug).toBe('test-post')
		})

		it('should support pagination', async () => {
			const result = await getEntries('test', 1, { page: 1, perPage: 10 })
			expect(result.meta.current_page).toBe(1)
		})
	})
})
```

---

## Phase 3: Component Tests (4-5 hours)

### Task 3.1: Test UI Components
Create `src/components/ui/__tests__/button.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
	it('should render button with text', () => {
		render(<Button>Click me</Button>)
		expect(screen.getByText('Click me')).toBeInTheDocument()
	})

	it('should call onClick when clicked', async () => {
		const user = userEvent.setup()
		const handleClick = jest.fn()
		render(<Button onClick={handleClick}>Click</Button>)

		await user.click(screen.getByText('Click'))
		expect(handleClick).toHaveBeenCalledTimes(1)
	})

	it('should be disabled when disabled prop is true', () => {
		render(<Button disabled>Disabled</Button>)
		expect(screen.getByText('Disabled')).toBeDisabled()
	})

	it('should apply variant classes', () => {
		render(<Button variant='destructive'>Delete</Button>)
		const button = screen.getByText('Delete')
		expect(button).toHaveClass('bg-destructive')
	})
})
```

Similar tests for: `card.test.tsx`, `badge.test.tsx`, `alert.test.tsx`, `input.test.tsx`, `textarea.test.tsx`

### Task 3.2: Test Navigation Component
Create `src/components/__tests__/navigation.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { Navigation } from '../navigation'

const mockItems = [
	{ id: 1, label: 'Home', url: '/', order: 1 },
	{ id: 2, label: 'Blog', url: '/blog', order: 2 }
]

describe('Navigation', () => {
	it('should render navigation items', () => {
		render(<Navigation items={mockItems} />)
		expect(screen.getByText('Home')).toBeInTheDocument()
		expect(screen.getByText('Blog')).toBeInTheDocument()
	})

	it('should render mobile menu toggle', () => {
		render(<Navigation items={mockItems} />)
		expect(screen.getByLabelText(/menu/i)).toBeInTheDocument()
	})

	it('should have correct hrefs', () => {
		render(<Navigation items={mockItems} />)
		const homeLink = screen.getByText('Home').closest('a')
		expect(homeLink).toHaveAttribute('href', '/')
	})
})
```

### Task 3.3: Test Form Builder Component
Create `src/components/rush/__tests__/form-builder.test.tsx`:

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormBuilder } from '../form-builder'

const mockForm = {
	id: 1,
	key: 'contact',
	name: 'Contact Form',
	fields: [
		{
			id: 1,
			type: 'text' as const,
			config: { name: 'name', placeholder: 'Your name' },
			validation: { is_required: true }
		},
		{
			id: 2,
			type: 'email' as const,
			config: { name: 'email', placeholder: 'Your email' },
			validation: { is_required: true }
		}
	]
}

describe('FormBuilder', () => {
	it('should render form fields', () => {
		render(<FormBuilder form={mockForm} siteSlug='test' />)
		expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument()
	})

	it('should submit form successfully', async () => {
		const user = userEvent.setup()
		render(<FormBuilder form={mockForm} siteSlug='test' />)

		await user.type(screen.getByPlaceholderText('Your name'), 'John Doe')
		await user.type(screen.getByPlaceholderText('Your email'), 'john@example.com')
		await user.click(screen.getByText('form.submit'))

		await waitFor(() => {
			expect(screen.getByText('form.success')).toBeInTheDocument()
		})
	})

	it('should show error on failed submission', async () => {
		server.use(
			http.post('*/forms/*/submit', () => {
				return HttpResponse.json({ error: 'Failed' }, { status: 500 })
			})
		)

		const user = userEvent.setup()
		render(<FormBuilder form={mockForm} siteSlug='test' />)

		await user.click(screen.getByText('form.submit'))

		await waitFor(() => {
			expect(screen.getByText(/error/i)).toBeInTheDocument()
		})
	})
})
```

### Task 3.4: Test Entry Renderer Component
Create `src/components/rush/__tests__/entry-renderer.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { EntryRenderer } from '../entry-renderer'

const mockEntry = {
	id: 1,
	slug: 'test',
	data: {
		title: 'Test Title',
		excerpt: 'Test excerpt',
		content: '<p>Test content</p>',
		featured_image: 'https://example.com/image.jpg',
		tags: ['tag1', 'tag2']
	},
	created_at: '2025-01-01T00:00:00Z'
}

describe('EntryRenderer', () => {
	it('should render entry title', () => {
		render(<EntryRenderer entry={mockEntry} />)
		expect(screen.getByText('Test Title')).toBeInTheDocument()
	})

	it('should render entry excerpt', () => {
		render(<EntryRenderer entry={mockEntry} />)
		expect(screen.getByText('Test excerpt')).toBeInTheDocument()
	})

	it('should render sanitized HTML content', () => {
		render(<EntryRenderer entry={mockEntry} />)
		expect(screen.getByText('Test content')).toBeInTheDocument()
	})

	it('should render boolean values with translations', () => {
		const entryWithBoolean = {
			...mockEntry,
			data: { ...mockEntry.data, published: true }
		}
		render(<EntryRenderer entry={entryWithBoolean} />)
		expect(screen.getByText('boolean.yes')).toBeInTheDocument()
	})

	it('should render tags', () => {
		render(<EntryRenderer entry={mockEntry} />)
		expect(screen.getByText('#tag1')).toBeInTheDocument()
		expect(screen.getByText('#tag2')).toBeInTheDocument()
	})
})
```

### Task 3.5: Test Pagination Component
Create `src/components/pagination/__tests__/pagination.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { Pagination } from '../pagination'

describe('Pagination', () => {
	it('should render page numbers', () => {
		render(<Pagination currentPage={1} totalPages={5} baseUrl='/blog' />)
		expect(screen.getByText('1')).toBeInTheDocument()
		expect(screen.getByText('2')).toBeInTheDocument()
	})

	it('should show ellipsis for large page counts', () => {
		render(<Pagination currentPage={5} totalPages={20} baseUrl='/blog' />)
		expect(screen.getByText('...')).toBeInTheDocument()
	})

	it('should disable previous on first page', () => {
		render(<Pagination currentPage={1} totalPages={5} baseUrl='/blog' />)
		const prevButton = screen.getByLabelText(/previous/i)
		expect(prevButton).toHaveAttribute('aria-disabled', 'true')
	})

	it('should disable next on last page', () => {
		render(<Pagination currentPage={5} totalPages={5} baseUrl='/blog' />)
		const nextButton = screen.getByLabelText(/next/i)
		expect(nextButton).toHaveAttribute('aria-disabled', 'true')
	})
})
```

---

## Phase 4: Hook Tests (1-2 hours)

### Task 4.1: Test `use-form-submit` Hook
Create `src/hooks/__tests__/use-form-submit.test.tsx`:

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useFormSubmit } from '../use-form-submit'

describe('useFormSubmit', () => {
	it('should submit form successfully', async () => {
		const { result } = renderHook(() =>
			useFormSubmit({ siteSlug: 'test', formKey: 'contact' })
		)

		await result.current.submit({ data: { name: 'John' } })

		await waitFor(() => {
			expect(result.current.success).toBe(true)
			expect(result.current.loading).toBe(false)
		})
	})

	it('should handle submission errors', async () => {
		server.use(
			http.post('*/forms/*/submit', () => {
				return HttpResponse.json({ error: 'Failed' }, { status: 500 })
			})
		)

		const { result } = renderHook(() =>
			useFormSubmit({ siteSlug: 'test', formKey: 'contact' })
		)

		await result.current.submit({ data: {} })

		await waitFor(() => {
			expect(result.current.error).toBeTruthy()
			expect(result.current.success).toBe(false)
		})
	})

	it('should reset form state', async () => {
		const { result } = renderHook(() =>
			useFormSubmit({ siteSlug: 'test', formKey: 'contact' })
		)

		await result.current.submit({ data: { name: 'John' } })
		await waitFor(() => expect(result.current.success).toBe(true))

		result.current.reset()

		expect(result.current.success).toBe(false)
		expect(result.current.error).toBeNull()
	})
})
```

---

## Phase 5: Integration Tests (2-3 hours)

### Task 5.1: Test API Route Handlers
Create `src/app/api/revalidate/__tests__/route.test.ts`:

```typescript
import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('POST /api/revalidate', () => {
	it('should revalidate path with valid secret', async () => {
		const request = new NextRequest('http://localhost:3000/api/revalidate', {
			method: 'POST',
			body: JSON.stringify({ secret: 'test-secret', path: '/blog' }),
			headers: { 'Content-Type': 'application/json' }
		})

		const response = await POST(request)
		expect(response.status).toBe(200)
	})

	it('should return 401 for invalid secret', async () => {
		const request = new NextRequest('http://localhost:3000/api/revalidate', {
			method: 'POST',
			body: JSON.stringify({ secret: 'wrong', path: '/blog' })
		})

		const response = await POST(request)
		expect(response.status).toBe(401)
	})

	it('should return 400 for missing path', async () => {
		const request = new NextRequest('http://localhost:3000/api/revalidate', {
			method: 'POST',
			body: JSON.stringify({ secret: 'test-secret' })
		})

		const response = await POST(request)
		expect(response.status).toBe(400)
	})
})
```

### Task 5.2: Test Page Components
Create `src/app/[locale]/blog/__tests__/page.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import BlogPage from '../page'

describe('Blog Page', () => {
	it('should render blog posts', async () => {
		const Component = await BlogPage({ params: Promise.resolve({ locale: 'pt-BR' }) })
		render(Component)

		await screen.findByText('Test Post')
		expect(screen.getByText('Test excerpt')).toBeInTheDocument()
	})

	it('should show no posts message when empty', async () => {
		server.use(
			http.get('*/collections/*/entries', () => {
				return HttpResponse.json({ data: [], meta: {} })
			})
		)

		const Component = await BlogPage({ params: Promise.resolve({ locale: 'pt-BR' }) })
		render(Component)

		expect(await screen.findByText(/no posts/i)).toBeInTheDocument()
	})
})
```

---

## Phase 6: Coverage Analysis & Gap Filling (1-2 hours)

### Task 6.1: Run Coverage Report
```bash
pnpm test:coverage
```

Analyze the coverage report in `coverage/lcov-report/index.html`

### Task 6.2: Identify Uncovered Code
Look for:
- Red lines in coverage report
- Branches not tested
- Edge cases missed
- Error handling paths

### Task 6.3: Write Additional Tests
Focus on:
- Untested error boundaries
- Conditional branches
- Edge cases in utilities
- Component variants not tested

### Task 6.4: Reach 90% Coverage Threshold
Keep writing tests until all metrics reach 90%:
- Branches: 90%
- Functions: 90%
- Lines: 90%
- Statements: 90%

---

## Definition of Done

- [ ] All testing infrastructure installed and configured
- [ ] Jest configuration with 90% coverage threshold
- [ ] MSW configured for API mocking
- [ ] All utility functions tested (lib/)
- [ ] All UI components tested (components/ui/)
- [ ] All Rush CMS components tested (components/rush/)
- [ ] All custom hooks tested (hooks/)
- [ ] API routes tested (app/api/)
- [ ] Key page components tested
- [ ] Coverage report shows ≥90% for all metrics
- [ ] All tests passing: `pnpm test`
- [ ] CI script works: `pnpm test:ci`
- [ ] No console warnings during tests
- [ ] Test files follow naming convention: `*.test.ts(x)`
- [ ] All tests are deterministic (no flaky tests)

---

## Common Pitfalls to Avoid

1. **Not mocking Next.js modules**: Always mock `next/navigation`, `next/image`, etc.
2. **Missing environment variables**: Ensure all required vars in `jest.setup.ts`
3. **Async issues**: Use `waitFor` for async operations
4. **Not cleaning up**: Always restore mocks in `afterEach`
5. **Hardcoded URLs**: Use environment variables in tests
6. **Ignoring edge cases**: Test error states, empty states, loading states
7. **Not testing user interactions**: Use `@testing-library/user-event` for clicks/typing
8. **Forgetting accessibility**: Test ARIA labels, keyboard navigation

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing/jest)

---

## Success Criteria

✅ Coverage report shows 90%+ for branches, functions, lines, statements
✅ All tests pass in CI environment
✅ Tests run in under 60 seconds
✅ No warnings or errors in test output
✅ Code merged to main branch with commit message: `test: implement comprehensive testing suite with 90% coverage`
