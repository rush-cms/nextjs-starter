# Sprint #9 - Dynamic Collections System with Block Renderers

**Started**: 2025-01-12 23:10
**Estimated**: 8-10 hours
**Status**: IN_PROGRESS
**Priority**: High

## Goal
Transform the Rush CMS Next.js starter from a static blog template into a fully dynamic, collection-agnostic system that can handle any type of content (blog, products, team, pages, etc.) with zero configuration.

## Context

### Current State
- ❌ Collections are hardcoded via `.env` (BLOG_COLLECTION_ID=6, PAGES_COLLECTION_ID=7)
- ❌ Routes are fixed (`/blog`, `/blog/[slug]`)
- ❌ No block rendering system - only basic richtext parsing
- ✅ Pagination already works (client-side, 9 items per page)
- ✅ Tag archive pages exist but incomplete

### Target State
- ✅ Zero collection config in `.env` (only API credentials)
- ✅ Dynamic routes: `/[collectionSlug]` and `/[collectionSlug]/[entrySlug]`
- ✅ Homepage with sections for each collection
- ✅ Full block rendering system (13 block types)
- ✅ Graceful degradation for unknown blocks
- ✅ Generic, reusable components for any collection

### Known Constraints
- Max 4 collections per site
- Pagination already implemented (client-side)
- All collections have: `id`, `name`, `slug`, `description`, `items_per_page`
- All entries have: `id`, `title`, `slug`, `excerpt`, `featured_image`, `published_at`, `data`
- Blocks are fixed (13 types total)

## API Reference

### Collections API
\`\`\`bash
GET /api/v1/{site-slug}/collections
Response: {
  "data": [
    {
      "id": 6,
      "name": "Blog",
      "slug": "blog",
      "description": "Blog posts",
      "items_per_page": 10,
      "entries_count": 5
    }
  ]
}
\`\`\`

### Entry Structure
\`\`\`json
{
  "id": 1,
  "title": "My Entry",
  "slug": "my-entry",
  "excerpt": "Entry description",
  "featured_image": {
    "id": 5,
    "name": "featured",
    "file_name": "featured.webp",
    "mime_type": "image/webp",
    "size": 45678,
    "url": "http://localhost/storage/2/5/featured.webp",
    "thumb": "http://localhost/storage/2/5/conversions/featured-thumb.webp",
    "preview": "http://localhost/storage/2/5/conversions/featured-preview.webp"
  },
  "published_at": "2025-01-12T08:00:00+00:00",
  "data": {
    "content": [
      {
        "type": "richtext",
        "data": {
          "content": { /* TipTap JSON */ }
        }
      },
      {
        "type": "image",
        "data": {
          "image": { /* same structure as featured_image */ },
          "caption": "Image caption",
          "alt": "Alt text",
          "alignment": "center"
        }
      }
    ],
    "categories": ["Category 1", "Category 2"],
    "custom_field": "any value"
  },
  "tags": [
    { "id": 1, "name": "Tag", "slug": "tag" }
  ]
}
\`\`\`

### Block Types Available
**Basic**: callout, toggle, quote, richtext, paragraph
**Media**: image, gallery, video
**Embed**: youtube, embed, bookmark
**Advanced**: alert, divider, code, columns, button

## Tasks

### Phase 1: Foundation & Types [P1]
- [ ] 1.1 Update TypeScript types for collections
  - Add `RushCMSImage` interface with thumb/preview
  - Update `RushCMSEntry` to use proper featured_image type
  - Create `BlockData` union type for all block types
  - Create `BaseBlockProps` interface
- [ ] 1.2 Add API functions for collections
  - `getCollections(siteSlug)` - List all collections
  - `getCollection(siteSlug, collectionSlug)` - Single collection
  - `getEntriesByCollection(siteSlug, collectionSlug, params)` - Generic entries fetcher
  - `getEntryBySlug(siteSlug, collectionSlug, entrySlug)` - Generic entry fetcher
- [ ] 1.3 Update config to remove collection IDs
  - Remove BLOG_COLLECTION_ID and PAGES_COLLECTION_ID from .env
  - Keep only API_URL, API_TOKEN, SITE_SLUG, NAVIGATION_ID
  - Update config.ts to reflect changes

### Phase 2: Block Rendering System [P1]
- [ ] 2.1 Create base block components structure
  - `src/components/blocks/index.ts` - BlockRenderers map
  - `src/components/blocks/types.ts` - Shared block types
  - `src/components/blocks/unknown-block.tsx` - Fallback component
- [ ] 2.2 Implement Basic blocks
  - `richtext-block.tsx` - Parse and render TipTap JSON
  - `quote-block.tsx` - Styled blockquote
  - `callout-block.tsx` - Info/warning/success boxes
  - `toggle-block.tsx` - Collapsible accordion
  - `paragraph-block.tsx` - Simple text paragraph
- [ ] 2.3 Implement Media blocks
  - `image-block.tsx` - Single image with caption, alignment, zoom
  - `gallery-block.tsx` - Image grid with lightbox
  - `video-block.tsx` - Video player (HTML5)
- [ ] 2.4 Implement Embed blocks
  - `youtube-block.tsx` - YouTube iframe embed
  - `embed-block.tsx` - Generic iframe embed
  - `bookmark-block.tsx` - Link preview card
- [ ] 2.5 Implement Advanced blocks
  - `alert-block.tsx` - Alert banners (info/warning/error/success)
  - `divider-block.tsx` - Horizontal divider
  - `code-block.tsx` - Syntax highlighted code (use Prism/Highlight.js)
  - `columns-block.tsx` - Multi-column layout
  - `button-block.tsx` - CTA button

### Phase 3: Dynamic Routing [P1]
- [ ] 3.1 Create dynamic collection listing page
  - `src/app/[collectionSlug]/page.tsx`
  - Fetch collection by slug
  - Fetch entries for collection
  - Reuse BlogListing component (rename to EntryListing)
  - Generate static params for all collections
- [ ] 3.2 Create dynamic entry detail page
  - `src/app/[collectionSlug]/[entrySlug]/page.tsx`
  - Fetch entry by collection slug + entry slug
  - Create generic EntryDetail component
  - Render featured_image, title, excerpt, published_at
  - Render blocks using BlockRenderers
  - Generate static params for all entries
- [ ] 3.3 Migrate existing /blog routes
  - Keep `/blog` as redirect or move content to dynamic route
  - Update internal links to use `/[collectionSlug]` pattern
  - Update navigation to use collection slugs

### Phase 4: Homepage Dynamic Sections [P2]
- [ ] 4.1 Create collection section component
  - `src/components/collection-section.tsx`
  - Takes collection + entries
  - Renders section header with collection name
  - Grid of entry cards
  - "View all" link to collection page
- [ ] 4.2 Update homepage
  - Fetch all collections
  - For each collection, fetch latest N entries (6-8)
  - Render CollectionSection for each
  - Add hero section at top
- [ ] 4.3 Create generic EntryCard component
  - Replaces BlogCard
  - Works with any entry type
  - Shows featured_image (thumb), title, excerpt, published_at
  - Links to `/[collectionSlug]/[entrySlug]`

### Phase 5: Polish & Testing [P2]
- [ ] 5.1 Update metadata generation
  - Make generateEntryMetadata collection-agnostic
  - Use featured_image for og:image
  - Handle missing data gracefully
- [ ] 5.2 Add error boundaries
  - Wrap block renderers in error boundaries
  - Graceful fallback for render errors
- [ ] 5.3 Update breadcrumbs
  - Make dynamic based on collection
  - `/[collection]` → Collection Name
  - `/[collection]/[entry]` → Collection Name → Entry Title
- [ ] 5.4 Test with different content types
  - Create test collections (products, team, pages)
  - Verify all blocks render correctly
  - Check responsive design
  - Test pagination across collections
- [ ] 5.5 Documentation
  - Update README with new architecture
  - Document how to add custom blocks
  - Document .env configuration

## Technical Decisions

### Block Rendering Strategy
Use React component mapping with graceful degradation:
\`\`\`typescript
const Block = BlockRenderers[block.type] || UnknownBlock
return <Block key={i} type={block.type} data={block.data} />
\`\`\`

**Benefits**:
- Never breaks production (unknown blocks = null)
- Clear dev feedback (warning + visual indicator)
- Type-safe for known blocks
- Easy to extend (just add to map)

### Image Handling
Use Next.js Image component with featured_image structure:
\`\`\`typescript
<Image
  src={entry.featured_image.url}
  alt={entry.title}
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={entry.featured_image.thumb}
/>
\`\`\`

### Static Generation Strategy
- Generate all collection pages at build time
- Generate first page of entries per collection
- Use `dynamicParams: true` for remaining entries (ISR)
- Revalidate every 30 minutes (configurable)

### Pagination
Keep existing client-side pagination (already works):
- Fetch all entries for collection
- Paginate in BlogListing/EntryListing component
- Works well with max 4 collections and limited entries

## Definition of Done

- [ ] Zero collection IDs in .env
- [ ] All 13 block types render correctly
- [ ] Unknown blocks show warning in dev, null in prod
- [ ] Dynamic routes work for any collection
- [ ] Homepage shows sections for all collections
- [ ] Featured images display with thumb/preview
- [ ] Pagination works across all collections
- [ ] Metadata generation is collection-agnostic
- [ ] No TypeScript errors
- [ ] No console errors in production
- [ ] Responsive design maintained
- [ ] All tests pass (if applicable)

## Dependencies

### External
- None (all blocks use existing Tailwind + React)

### Internal
- Existing pagination system (BlogListing)
- Existing API client (rush-cms.ts)
- Existing metadata utilities

## Risks & Mitigations

**Risk**: Unknown block types break rendering
**Mitigation**: UnknownBlock fallback + error boundaries

**Risk**: Featured image structure changes
**Mitigation**: Optional chaining + fallbacks for missing images

**Risk**: Too many static routes at build time
**Mitigation**: Use ISR for entries, only pre-render collections + featured entries

**Risk**: Breaking existing blog functionality
**Mitigation**: Keep /blog routes initially, migrate incrementally

## Notes

- RichText blocks contain TipTap JSON - need JSON parser/renderer
- Gallery blocks need lightbox functionality (use existing library)
- Code blocks need syntax highlighting (Prism.js or highlight.js)
- Video blocks should support both uploaded videos and URLs
- Columns block needs responsive breakpoints (stack on mobile)

## Success Metrics

- Build time < 30s with 4 collections × 20 entries
- Zero hardcoded collection references in code
- 100% block coverage (all 13 types)
- Lighthouse score > 90 (Performance, Accessibility, SEO)
