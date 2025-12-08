# Next.js Rush CMS Starter

[![CI/CD](https://github.com/rush-cms/nextjs-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/rush-cms/nextjs-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

Production-ready Next.js 16 starter for [Rush CMS](https://rushcms.com). Built with the official SDK, TypeScript strict mode, and real-world patterns.

## Why This Starter?

Most CMS starters are toy projects. This one isn't:
- 🎯 **Real SDK Integration** - Uses official `@rushcms/client`, `@rushcms/react`, and `@rushcms/types`
- 🔒 **Type-Safe Everything** - No `any`, no shortcuts, strict TypeScript
- ⚡ **Fast by Default** - Static generation, ISR, smart caching
- 🎨 **Actual UI** - Not just "hello world", but real components you'll actually use
- 📱 **Mobile-First** - Because most of your users are on phones
- 🧪 **Tested** - Unit tests, E2E tests, CI/CD pipeline included

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/rush-cms-nextjs-starter.git
cd rush-cms-nextjs-starter
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your Rush CMS credentials

# Run locally
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). That's it.

## What's Included

### Content Types Out of the Box

- **Blog Posts** - Full blog with pagination, tags, search, and SEO (`/blog`)
- **Pages** - Dynamic pages from any collection (`/[slug]`)
- **LinkPages** - Linktree-style pages (`/l/[key]`)
- **Forms** - Contact forms with validation (`/contact`)
- **Navigation** - Auto-generated menus from Rush CMS

### Features That Actually Matter

**Content & Blocks:**
- ✅ Rich text rendering (TipTap format)
- ✅ 15+ block types (YouTube, Gallery, Code, Callout, Quote, etc.)
- ✅ Image optimization with Next.js Image
- ✅ Video embeds with lazy loading
- ✅ Code syntax highlighting

**UX:**
- ✅ Smart search with debouncing
- ✅ Pagination with ellipsis
- ✅ Table of contents with scroll spy
- ✅ Share buttons (Twitter, Facebook, LinkedIn, Email)
- ✅ Loading states and error boundaries
- ✅ Breadcrumbs navigation

**Developer Experience:**
- ✅ Official Rush CMS SDK
- ✅ React hooks for data fetching
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier configured
- ✅ Vitest for unit tests
- ✅ CI/CD with GitHub Actions

**Performance & Security:**
- ✅ Static generation + ISR
- ✅ On-demand revalidation
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ Rate limiting on API routes
- ✅ XSS protection
- ✅ Input validation

**Analytics:**
- ✅ Google Analytics 4 ready
- ✅ Plausible Analytics support
- ✅ Custom event tracking

## Environment Setup

Copy `.env.example` to `.env`:

```env
# Rush CMS API (required)
NEXT_PUBLIC_API_URL=https://your-rush-cms.com
API_TOKEN=your-sanctum-token
SITE_SLUG=default
SITE_ID=1

# Collections (required)
BLOG_COLLECTION_ID=1
PAGES_COLLECTION_ID=2

# Navigation & Forms (required)
NAVIGATION_KEY=main-menu
CONTACT_FORM_KEY=contact

# Revalidation (required)
REVALIDATE_SECRET=generate-a-random-secret
REVALIDATE_TIME=1800

# Media (required)
NEXT_PUBLIC_S3_URL=https://your-bucket.s3.amazonaws.com

# Site Info (required)
NEXT_PUBLIC_SITE_NAME=My Site
NEXT_PUBLIC_SITE_URL=https://your-site.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-site.com
```

## Project Structure

```
src/
├── app/                      # Next.js 16 App Router
│   ├── blog/                 # Blog routes
│   ├── l/[key]/             # LinkPages (Linktree-style)
│   ├── [slug]/              # Dynamic pages
│   └── api/                 # API routes (forms, revalidation)
├── components/
│   ├── blocks/              # Content blocks (SDK components)
│   ├── rush/                # Rush CMS specific components
│   ├── ui/                  # Reusable UI components
│   └── share/               # Share buttons
├── lib/
│   ├── rush-cms.ts          # API helpers (legacy)
│   ├── rush-cms-sdk.ts      # Official SDK client
│   ├── config.ts            # App configuration
│   └── utils.ts             # Utilities
└── types/
    └── rush-cms.ts          # TypeScript types
```

## Using the SDK

This starter uses the official Rush CMS SDK packages:

```typescript
import { rushcmsClient } from '@/lib/rush-cms-sdk'

// Fetch entries
const response = await rushcmsClient.getEntries(collectionId, {
	page: 1,
	per_page: 10,
	tags: ['typescript', 'nextjs']
})

// Fetch single entry
const entry = await rushcmsClient.getEntry(collectionId, 'my-slug')

// Fetch navigation
const nav = await rushcmsClient.getNavigation('main-menu')

// Fetch LinkPages
const linkPages = await rushcmsClient.getLinkPages()
const linkPage = await rushcmsClient.getLinkPage('john-doe')
```

**React Hooks (Client-Side):**

```typescript
'use client'

import { useEntries, useEntry, useLinkPage } from '@rushcms/react'

function MyComponent() {
	const { entries, loading, error } = useEntries({
		collectionId: 1,
		params: { per_page: 10 }
	})

	const { linkPage } = useLinkPage({ key: 'john-doe' })

	// ...
}
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/blog` | Blog archive with pagination |
| `/blog/[slug]` | Single blog post |
| `/blog/tag/[slug]` | Posts by tag |
| `/l/[key]` | LinkPage (Linktree-style) |
| `/[slug]` | Dynamic page from any collection |
| `/[slug]/[entrySlug]` | Nested entry pages |
| `/contact` | Contact form |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Robots file |

## LinkPages

Linktree-style pages with custom branding:

```typescript
// Automatic static generation
// Access at: /l/your-key

interface LinkPage {
	key: string
	title: string
	description: string
	avatar: string
	links: LinkPageLink[]           // Custom links with icons
	social_links: LinkPageSocialLink[]  // Social media links
	settings: {
		background_color: string
		button_color: string
		text_color: string
	}
}
```

**Supported Icons:**
- Regular: link, globe, envelope, phone, shopping-cart, camera, etc. (20 total)
- Social: Instagram, Facebook, Twitter, LinkedIn, YouTube, GitHub, etc. (12 platforms)

## Content Blocks

All blocks from Rush CMS are supported:

- `richtext` - TipTap rich text editor content
- `image` - Optimized images with lightbox
- `gallery` - Image galleries (grid, masonry, carousel)
- `video` - Self-hosted videos
- `youtube` - YouTube embeds with privacy mode
- `embed` - Generic iframe embeds
- `code` - Syntax highlighted code blocks
- `quote` - Blockquotes with author
- `callout` - Info boxes (info, warning, success, error)
- `alert` - Alert messages
- `toggle` - Collapsible content
- `bookmark` - Link previews
- `divider` - Horizontal dividers
- `columns` - Multi-column layouts
- `button` - Call-to-action buttons

## Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rush-cms/nextjs-starter)

```bash
pnpm i -g vercel
vercel
```

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

```bash
pnpm i -g netlify-cli
netlify deploy --prod
```

**Post-Deployment:**
1. Set environment variables in your platform dashboard
2. Configure webhook for on-demand revalidation:
   - URL: `https://your-site.com/api/revalidate`
   - Secret: Your `REVALIDATE_SECRET`
3. Test revalidation: `curl -X POST https://your-site.com/api/revalidate?secret=YOUR_SECRET`

## On-Demand Revalidation

Setup webhook in Rush CMS to auto-update your site:

```bash
# Revalidate all pages
POST https://your-site.com/api/revalidate?secret=YOUR_SECRET

# Revalidate specific path
POST https://your-site.com/api/revalidate?secret=YOUR_SECRET&path=/blog/my-post
```

## Customization

**Add Custom Collection:**

```typescript
// 1. Define types
interface ProductData {
	price: number
	stock: number
	images: string[]
}

// 2. Create route
// src/app/products/[slug]/page.tsx
export default async function ProductPage({ params }) {
	const product = await rushcmsClient.getEntry(PRODUCTS_COLLECTION_ID, params.slug)
	return <ProductTemplate product={product} />
}

// 3. Add to sitemap
// src/app/sitemap.ts
const products = await rushcmsClient.getEntries(PRODUCTS_COLLECTION_ID)
```

**Add Custom Block:**

```typescript
// 1. Define type in src/types/rush-cms.ts
export interface CustomBlock {
	type: 'custom'
	data: {
		// your fields
	}
}

// 2. Create component
// src/components/blocks/custom-block.tsx
export function CustomBlock({ block }: { block: CustomBlock }) {
	return <div>{/* render your block */}</div>
}

// 3. Add to BlockRenderer
// src/components/blocks/block-renderer.tsx
case 'custom':
	return <CustomBlock block={block as CustomBlock} />
```

## Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Lint code
pnpm type-check       # TypeScript check
pnpm test             # Run tests
pnpm test:ci          # Run tests in CI mode
```

## Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Language:** TypeScript 5.0 (strict mode)
- **Styling:** Tailwind CSS 3
- **CMS:** Rush CMS (official SDK)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + Testing Library
- **CI/CD:** GitHub Actions
- **Deploy:** Vercel / Netlify

## Contributing

PRs welcome! Please:
1. Follow the existing code style (check `CLAUDE.md` for guidelines)
2. Add tests for new features
3. Update documentation
4. Keep commits atomic and lowercase

## License

MIT - see [LICENSE](LICENSE)

## Support

- 📚 [Rush CMS Docs](https://docs.rushcms.com)
- 💬 [GitHub Issues](https://github.com/rush-cms/nextjs-starter/issues)
- 🐦 [Twitter](https://twitter.com/rushcms)

---

Built with ❤️ by the Rush CMS team
