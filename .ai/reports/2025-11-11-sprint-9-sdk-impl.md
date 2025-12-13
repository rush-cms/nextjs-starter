# Architectural Decisions

## [2025-11-11] - Next.js 16 with App Router

**Context**: Need to choose Next.js version and routing strategy for Rush CMS starter.

**Decision**: Use Next.js 16 with App Router (not Pages Router)

**Consequences**:
- Pro: Server Components by default (better performance)
- Pro: Built-in streaming and Suspense support
- Pro: Simplified data fetching (async components)
- Pro: Better TypeScript integration
- Pro: Future-proof (Pages Router in maintenance mode)
- Con: Learning curve for developers familiar with Pages Router
- Con: Some libraries not yet compatible with App Router

**Alternatives Considered**:
- Next.js 14 (rejected: already outdated)
- Pages Router (rejected: legacy approach)
- Remix (rejected: less ecosystem, more complex)

**Status**: Implemented

---

## [2025-11-11] - Tailwind CSS v4 with PostCSS Plugin

**Context**: Tailwind CSS v4 introduces new architecture with postcss plugin instead of traditional config.

**Decision**: Use Tailwind CSS v4 with @tailwindcss/postcss plugin

**Consequences**:
- Pro: Simpler configuration (CSS imports only)
- Pro: Faster build times
- Pro: Better tree-shaking
- Pro: CSS-first approach (more standard)
- Con: Some plugins may not be compatible yet
- Con: Different from v3 documentation online

**Alternatives Considered**:
- Tailwind CSS v3 (rejected: outdated)
- Custom CSS with CSS Modules (rejected: loses utility benefits)
- Styled Components (rejected: runtime overhead, not aligned with project goals)

**Status**: Implemented

---

## [2025-11-11] - Hybrid Rendering (SSG + ISR + On-Demand Revalidation)

**Context**: Need to balance performance (static) with content freshness (dynamic).

**Decision**: Implement SSG + ISR + webhook-based on-demand revalidation

**Consequences**:
- Pro: TTFB < 50ms (static HTML from CDN)
- Pro: Content updates within seconds (webhook triggers revalidation)
- Pro: Minimal API calls to Rush CMS (cached)
- Pro: Scales well (CDN handles traffic)
- Con: More complex setup (webhook configuration)
- Con: Requires public endpoint for webhooks
- Con: Potential cache invalidation edge cases

**Alternatives Considered**:
- Pure SSG (rejected: stale content between builds)
- Pure SSR (rejected: 300-800ms TTFB, high Rush CMS load)
- Client-side only (rejected: SEO issues, slow initial load)

**Status**: Approved - To be implemented in Sprint #4

---

## [2025-11-11] - Server-Side Only API Token

**Context**: Rush CMS API requires Bearer token authentication.

**Decision**: API_TOKEN stored server-side only, never exposed to browser

**Consequences**:
- Pro: Security - token cannot be stolen from client
- Pro: Complies with best practices
- Pro: Works with ISR (server-side data fetching)
- Con: No client-side direct API calls
- Con: Requires API routes for client-initiated actions

**Alternatives Considered**:
- Client-side token (rejected: security risk)
- Per-user tokens (rejected: over-engineered for headless CMS)

**Status**: Implemented (in .env.example)

---

## [2025-11-11] - TypeScript Strict Mode

**Context**: Project requires strong typing to prevent runtime errors.

**Decision**: Enable TypeScript strict mode, no any types allowed

**Consequences**:
- Pro: Catches errors at compile time
- Pro: Better IDE autocomplete
- Pro: Self-documenting code
- Pro: Easier refactoring
- Con: More initial effort defining types
- Con: Some libraries have poor type definitions

**Alternatives Considered**:
- Loose TypeScript (rejected: defeats purpose of TypeScript)
- JavaScript only (rejected: not aligned with project requirements)

**Status**: Implemented (tsconfig.json strict: true)

---

## [2025-11-11] - Configurable Cache Times per Content Type

**Context**: Different content types have different update frequencies.

**Decision**: Allow per-content-type revalidation times via environment variables

**Consequences**:
- Pro: Flexibility - institutional (1h), blog (30min), inventory (5min)
- Pro: Optimizes Rush CMS API usage
- Pro: Balances freshness vs performance per use case
- Con: More environment variables to manage
- Con: Requires documentation for users

**Alternatives Considered**:
- Single global cache time (rejected: one-size-fits-all doesn't work)
- No caching (rejected: poor performance)
- Client-side SWR (rejected: server-side rendering benefits lost)

**Status**: Approved - To be implemented in Sprint #1

---

## [2025-11-11] - File Naming Convention: kebab-case

**Context**: CLAUDE.md mandates kebab-case for all files.

**Decision**: All files use kebab-case (my-component.tsx, not MyComponent.tsx)

**Consequences**:
- Pro: Consistency across project
- Pro: Avoids case-sensitivity issues on different OS
- Pro: Matches CLAUDE.md requirements
- Con: Different from some React conventions (PascalCase components)

**Alternatives Considered**:
- PascalCase for components (rejected: violates CLAUDE.md)
- snake_case (rejected: not common in JS/TS ecosystem)

**Status**: Implemented (enforced)

---

## [2025-11-11] - No UI Component Library (Initially)

**Context**: Need to decide whether to use pre-built UI library or custom components.

**Decision**: Start with custom Tailwind components, add library only if user requests

**Consequences**:
- Pro: Full control over styling
- Pro: Smaller bundle size
- Pro: No library-specific learning curve
- Pro: Easier to customize
- Con: More initial development time
- Con: Need to build accessibility from scratch

**Alternatives Considered**:
- Shadcn/ui (deferred: can add later if needed)
- Headless UI (deferred: overkill for starter)
- Material UI (rejected: heavy, opinionated)

**Status**: Approved - Re-evaluate in Sprint #6

---

## [2025-11-11] - pnpm as Package Manager

**Context**: pnpm-lock.yaml present, need to choose package manager.

**Decision**: Use pnpm for all package management

**Consequences**:
- Pro: Faster installs than npm
- Pro: Disk space efficient (shared dependencies)
- Pro: Strict dependency resolution
- Con: Less common than npm/yarn (lower ecosystem familiarity)

**Alternatives Considered**:
- npm (rejected: slower, less efficient)
- yarn (rejected: not as modern as pnpm)
- bun (rejected: too bleeding edge)

**Status**: Implemented (pnpm-lock.yaml)

---

## [2025-11-11] - Code Style: CLAUDE.md Overrides

**Context**: CLAUDE.md has specific coding standards.

**Decision**: Follow CLAUDE.md rules strictly:
- Single quotes (')
- No semicolons
- Tab indentation (size 4) for .ts/.tsx
- No trailing commas
- kebab-case filenames

**Consequences**:
- Pro: Consistency with project requirements
- Pro: Clear guidelines
- Con: Contradicts some Prettier/ESLint defaults
- Con: Need to configure linters carefully

**Alternatives Considered**:
- Standard Prettier config (rejected: violates requirements)
- No formatting rules (rejected: inconsistent code)

**Status**: Implemented (enforced in code reviews)

---

## Future Decisions Needed

### Authentication for Preview Mode
**Question**: How to handle draft content preview?
**Options**: JWT tokens, shared secret, separate preview API
**Timeline**: Sprint #9

### Form Validation Library
**Question**: Zod, Yup, or manual validation?
**Options**: Zod + React Hook Form, Yup, manual
**Timeline**: Sprint #2 (FormBuilder component)

### Analytics Integration
**Question**: Google Analytics 4, Plausible, or Rush CMS only?
**Options**: Rush CMS built-in, GA4, Plausible, none
**Timeline**: Sprint #4

---

## [2025-11-11] - Remove Client-Side Data Fetching Hooks

**Context**: Sprint #1 initially created 4 hooks (use-entries, use-collections, use-navigation, use-form-submit) for client-side data fetching. However, Next.js 16 App Router architecture makes most of these unnecessary.

**Decision**: Remove use-entries, use-collections, and use-navigation. Keep only use-form-submit.

**Consequences**:
- Pro: Server Components fetch data directly (more secure, faster)
- Pro: API_TOKEN stays server-side only (never exposed to browser)
- Pro: Better SEO (server-rendered content)
- Pro: ISR caching works automatically (no extra code)
- Pro: Simpler architecture (less code to maintain)
- Pro: Lower API usage (cached server-side fetches)
- Con: Client-side filtering/search requires different approach

**Alternatives Considered**:
- Keep hooks + create API routes (rejected: unnecessary complexity, exposes patterns)
- Remove all hooks including use-form-submit (rejected: forms need client-side submission)

**Implementation**:
```typescript
// ✅ CORRECT - Server Component (async)
import { getEntries } from '@/lib/rush-cms'

export default async function BlogPage() {
  const entries = await getEntries('site-slug', 1)
  return <div>{entries.map(...)}</div>
}

// ✅ CORRECT - Client Component for forms only
'use client'
import { useFormSubmit } from '@/hooks/use-form-submit'

export function ContactForm() {
  const { submit, loading } = useFormSubmit({ siteSlug, formKey })
  return <form onSubmit={...}>...</form>
}
```

**Status**: Implemented


## [2025-11-13] - Optional Root Collection for Clean URLs

**Context**: Sites need institutional pages with clean URLs (e.g., `/about`, `/contact`) instead of collection-prefixed URLs (e.g., `/pages/about`, `/pages/contact`). The dynamic collection routing system `[collectionSlug]` works well for most content but creates unnecessarily verbose URLs for core institutional pages.

**Decision**: Implement optional root collection routing via `ROOT_COLLECTION_SLUG` environment variable. When set, entries from the specified collection are accessible at `/{slug}` instead of `/{collectionSlug}/{slug}`.

**Consequences**:
- Pro: Clean, professional URLs for institutional pages (`/about` vs `/pages/about`)
- Pro: Matches user expectations (standard web pattern)
- Pro: Better UX for end users (shorter, cleaner URLs)
- Pro: Optional feature - disabled if env var not set
- Pro: Graceful degradation - if collection doesn't exist, no errors
- Pro: SEO-friendly URLs
- Con: Potential naming conflicts (entry slug vs collection slug)
- Con: Fixed priority order (`[slug]` always checked before `[collectionSlug]`)
- Con: May confuse developers about URL structure
- Con: More complex sitemap generation logic

**Alternatives Considered**:
- Option 1: Middleware with rewrite (rejected: doesn't solve route conflict, adds API calls)
- Option 3: Static routes per page (rejected: not dynamic, requires file per page)
- Keep all URLs with collection prefix (rejected: poor UX for institutional sites)

**Implementation Details**:
```typescript
// .env.local
ROOT_COLLECTION_SLUG=pages  // Optional, defaults to undefined

// src/lib/config.ts
routing: {
  rootCollectionSlug: process.env.ROOT_COLLECTION_SLUG || undefined
}

// src/app/[slug]/page.tsx
// Only generates routes if ROOT_COLLECTION_SLUG is set
// Only fetches from specified collection
// Returns 404 if collection doesn't exist
```

**URL Structure**:
```
/ → Homepage
/about → Entry from root collection (pages)
/contact → Entry from root collection (pages)
/blog → Collection archive (blog)
/blog/post-1 → Entry from blog collection
/produtos → Collection archive (produtos)
/produtos/produto-x → Entry from produtos collection
```

**Routing Priority** (Next.js resolves in order):
1. Static routes (/, /blog, /contact if defined statically)
2. `[slug]` - Root collection entries
3. `[collectionSlug]` - Collection archives
4. `[collectionSlug]/[entrySlug]` - Collection entries

**Conflict Mitigation**:
- Use naming convention: collections plural (e.g., `products`), root entries singular (e.g., `about`)
- Document clearly which collection is root
- Consider collections with semantic prefixes (e.g., `blog`, `news`, `events` unlikely to conflict with `about`, `contact`)

**Status**: Implemented
