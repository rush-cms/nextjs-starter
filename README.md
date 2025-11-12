# Next.js Rush CMS Starter

A modern, production-ready Next.js 16 starter template for [Rush CMS](https://rushcms.com) - a powerful Laravel-based headless CMS.

## Features

- ✅ **Next.js 16 App Router** - Server Components, ISR, and streaming
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **Mobile-First** - Responsive design patterns
- ✅ **SEO Optimized** - Dynamic sitemap, robots.txt, Open Graph
- ✅ **Analytics Ready** - Google Analytics & Plausible support
- ✅ **On-Demand Revalidation** - Webhook-based cache invalidation
- ✅ **Form Builder** - Dynamic forms from Rush CMS
- ✅ **Block Editor** - Rich content rendering (YouTube, Gallery, Quotes, etc.)
- ✅ **Error Boundaries** - Graceful error handling with recovery
- ✅ **Loading States** - Skeleton loaders and spinners

## Prerequisites

- Node.js 18+ and pnpm
- A running Rush CMS instance (Laravel 12 + Filament 4)
- Rush CMS API token

## Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/rush-cms-nextjs-starter.git
cd rush-cms-nextjs-starter

# Install dependencies
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Variables:**

```env
# Rush CMS API
NEXT_PUBLIC_API_URL=https://your-rush-cms.com
API_TOKEN=your-sanctum-bearer-token
SITE_SLUG=default
SITE_ID=1

# Collections
BLOG_COLLECTION_ID=1
PAGES_COLLECTION_ID=2

# Navigation & Forms
NAVIGATION_ID=1
CONTACT_FORM_KEY=contact

# Revalidation
REVALIDATE_SECRET=your-random-secret-key-here
REVALIDATE_TIME=1800

# Media
NEXT_PUBLIC_S3_URL=https://your-bucket.s3.amazonaws.com

# Site Info
NEXT_PUBLIC_SITE_NAME=My Site
NEXT_PUBLIC_SITE_URL=https://your-site.com
```

**Optional Analytics:**

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-site.com
```

### 3. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
pnpm build
pnpm start
```

## On-Demand Revalidation Setup

Rush CMS can automatically invalidate Next.js cache when content is updated.

### Step 1: Generate Revalidation Secret

```bash
# Generate a secure random key
openssl rand -hex 32
```

Add to your `.env`:

```env
REVALIDATE_SECRET=your-generated-secret-here
```

### Step 2: Configure Webhook in Rush CMS

In your Rush CMS installation, configure the webhook:

**URL Format:**
```
https://your-nextjs-site.com/api/revalidate
```

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Payload Example (Path Revalidation):**
```json
{
  "secret": "your-revalidation-secret",
  "path": "/blog/my-post-slug"
}
```

**Payload Example (Tag Revalidation):**
```json
{
  "secret": "your-revalidation-secret",
  "tag": "blog-posts"
}
```

### Step 3: Test Revalidation

Test manually with curl:

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "path": "/"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Revalidation triggered successfully",
  "revalidated": {
    "path": "/",
    "tag": null
  },
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

### Rush CMS Observer Implementation

Add this observer to your Rush CMS Laravel application:

```php
<?php

namespace App\Observers;

use App\Models\Entry;
use Illuminate\Support\Facades\Http;

class EntryObserver
{
    public function updated(Entry $entry): void
    {
        $this->revalidateNextjs($entry);
    }

    public function deleted(Entry $entry): void
    {
        $this->revalidateNextjs($entry);
    }

    protected function revalidateNextjs(Entry $entry): void
    {
        $nextjsUrl = config('services.nextjs.url');
        $secret = config('services.nextjs.revalidate_secret');

        if (!$nextjsUrl || !$secret) {
            return;
        }

        // Determine path based on collection
        $path = match($entry->collection->slug) {
            'blog' => "/blog/{$entry->slug}",
            'pages' => "/{$entry->slug}",
            default => null,
        };

        if ($path) {
            Http::post("{$nextjsUrl}/api/revalidate", [
                'secret' => $secret,
                'path' => $path,
            ]);

            // Also revalidate listing pages
            if ($entry->collection->slug === 'blog') {
                Http::post("{$nextjsUrl}/api/revalidate", [
                    'secret' => $secret,
                    'path' => '/blog',
                ]);
            }
        }
    }
}
```

Register the observer in `AppServiceProvider`:

```php
use App\Models\Entry;
use App\Observers\EntryObserver;

public function boot(): void
{
    Entry::observe(EntryObserver::class);
}
```

Add to `config/services.php`:

```php
'nextjs' => [
    'url' => env('NEXTJS_URL', 'https://your-nextjs-site.com'),
    'revalidate_secret' => env('NEXTJS_REVALIDATE_SECRET'),
],
```

## Analytics Setup

### Google Analytics 4

1. Create a GA4 property in Google Analytics
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `.env`:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Plausible Analytics

1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Add to `.env`:

```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-site.com
```

### Custom Event Tracking

Use the analytics helpers in your code:

```typescript
import { trackEvent, trackFormSubmit, trackSearch } from '@/lib/analytics'

// Track custom events
trackEvent('button_click', { button_name: 'subscribe' })

// Track form submissions
trackFormSubmit('contact_form', true)

// Track search queries
trackSearch('next.js tutorial', 42)
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts          # Revalidation webhook endpoint
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx          # Blog post detail
│   │   └── page.tsx              # Blog listing
│   ├── [slug]/
│   │   └── page.tsx              # Dynamic pages
│   ├── contact/
│   │   └── page.tsx              # Contact form
│   ├── error.tsx                 # Global error boundary
│   ├── loading.tsx               # Global loading state
│   ├── not-found.tsx             # 404 page
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # Robots.txt
├── components/
│   ├── analytics/
│   │   └── analytics-script.tsx  # Analytics integration
│   ├── rush/
│   │   ├── article.tsx           # Blog post renderer
│   │   ├── block-editor-renderer.tsx  # Block editor
│   │   ├── entry-renderer.tsx    # Generic entry renderer
│   │   └── form-builder.tsx      # Dynamic forms
│   ├── blog-card.tsx             # Blog card component
│   └── navigation.tsx            # Main navigation
├── lib/
│   ├── analytics.ts              # Analytics helpers
│   ├── config.ts                 # Centralized config
│   ├── date.ts                   # Date formatting
│   ├── rush-cms.ts               # API client
│   ├── sanitize.ts               # HTML sanitization
│   └── utils.ts                  # Utility functions
└── types/
    └── rush-cms.ts               # TypeScript types
```

## Available Scripts

```bash
# Development
pnpm dev          # Start dev server (localhost:3000)
pnpm type-check   # Run TypeScript compiler check
pnpm lint         # Run ESLint

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Deployment
pnpm deploy       # Deploy to configured platform
```

## Type Safety

This starter uses strict TypeScript with no `any` types:

```typescript
import type { BlogEntry } from '@/types/rush-cms'

// Fully typed API responses
const entries = await getEntries<BlogEntry>(siteSlug, collectionId)

// Type-safe component props
<BlogCard entry={entry} formatDate={formatDate} />
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

### Netlify

Create `netlify.toml`:

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Deploy:

```bash
# Install Netlify CLI
pnpm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

## Troubleshooting

### Issue: API requests failing

**Check:**
- `NEXT_PUBLIC_API_URL` is correct (no trailing slash)
- `API_TOKEN` is valid (regenerate in Rush CMS if needed)
- Rush CMS CORS settings allow your Next.js domain

### Issue: Images not loading

**Check:**
- `NEXT_PUBLIC_S3_URL` matches your media storage URL
- Add S3 domain to `next.config.js`:

```js
images: {
  domains: ['your-bucket.s3.amazonaws.com']
}
```

### Issue: Revalidation not working

**Check:**
- `REVALIDATE_SECRET` matches in both `.env` and Rush CMS webhook
- Webhook URL is correct (https://your-site.com/api/revalidate)
- Check Next.js logs for revalidation messages

### Issue: Analytics not tracking

**Check:**
- Analytics only loads in production (`NODE_ENV=production`)
- Environment variables use `NEXT_PUBLIC_` prefix
- Check browser console for errors (ad blockers may interfere)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit using conventional commits (`feat:`, `fix:`, `docs:`, etc.)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

This project follows strict code guidelines (see `CLAUDE.md`):

- Single quotes (`'`) not double quotes
- Tabs (size 4) for indentation
- No semicolons
- Kebab-case file names (`blog-card.tsx`)
- Mobile-first approach

## License

MIT

## Support

- **Rush CMS Documentation**: [https://docs.rushcms.com](https://docs.rushcms.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/rush-cms-nextjs-starter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/rush-cms-nextjs-starter/discussions)

---

Built with ❤️ using [Rush CMS](https://rushcms.com) and [Next.js](https://nextjs.org)
