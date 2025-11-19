# Next.js Rush CMS Starter

[![CI/CD](https://github.com/rush-cms/nextjs-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/rush-cms/nextjs-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

A modern, production-ready Next.js 16 starter template for [Rush CMS](https://rushcms.com) - a powerful Laravel-based headless CMS.

## 🚀 Quick Deploy

Deploy your own Rush CMS site in minutes:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rush-cms/nextjs-starter&env=NEXT_PUBLIC_API_URL,API_TOKEN,SITE_SLUG,SITE_ID,BLOG_COLLECTION_ID,PAGES_COLLECTION_ID,NAVIGATION_ID,CONTACT_FORM_KEY,REVALIDATE_SECRET,NEXT_PUBLIC_S3_URL,NEXT_PUBLIC_SITE_NAME,NEXT_PUBLIC_SITE_URL&envDescription=Rush%20CMS%20Configuration&envLink=https://github.com/rush-cms/nextjs-starter/blob/main/.env.example&project-name=my-rush-cms-site&repository-name=my-rush-cms-site)

**Or use as GitHub Template:**

1. Click **Use this template** button above
2. Clone your new repository
3. Install dependencies: `pnpm install`
4. Copy `.env.example` to `.env` and configure
5. Run locally: `pnpm dev`

## Features

### Core Features
- ✅ **Next.js 16 App Router** - Server Components, ISR, and streaming
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **Mobile-First** - Responsive design patterns
- ✅ **SEO Optimized** - Dynamic sitemap, robots.txt, Open Graph, JSON-LD
- ✅ **Analytics Ready** - Google Analytics & Plausible support
- ✅ **On-Demand Revalidation** - Webhook-based cache invalidation
- ✅ **Form Builder** - Dynamic forms from Rush CMS
- ✅ **Block Editor** - Rich content rendering (YouTube, Gallery, Quotes, etc.)
- ✅ **Error Boundaries** - Graceful error handling with recovery
- ✅ **Loading States** - Skeleton loaders and spinners

### Advanced Features
- ✅ **Search** - Client-side search with debounced input and URL persistence
- ✅ **Pagination** - Smart pagination with ellipsis and accessibility
- ✅ **Breadcrumbs** - Auto-generated breadcrumb navigation
- ✅ **Share Buttons** - Social media sharing (Twitter, Facebook, LinkedIn, Email, Copy link)
- ✅ **Table of Contents** - Auto-generated TOC with smooth scroll and active highlighting
- ✅ **UI Components** - Card, Badge, Alert with multiple variants

### Performance & Security
- ✅ **Security Headers** - X-Frame-Options, CSP, HSTS, and more
- ✅ **Rate Limiting** - API rate limiting with structured logging
- ✅ **Input Validation** - Server-side validation and XSS protection
- ✅ **Image Optimization** - Next.js Image component with S3/CDN support
- ✅ **Caching Strategy** - Aggressive caching for static assets

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

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guides for:
- **Netlify** - Complete setup with `netlify.toml` included
- **Vercel** - Complete setup with `vercel.json` included
- **Environment Variables** - Required and optional variables
- **Custom Domains** - SSL and domain configuration
- **Webhooks** - On-demand revalidation setup
- **Troubleshooting** - Common deployment issues

#### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

#### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

```bash
# Install Netlify CLI
pnpm i -g netlify-cli

# Deploy
netlify deploy --prod
```