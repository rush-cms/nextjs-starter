# Backlog - Next.js Rush CMS Starter

## High Priority

### Sprint #2 - Core Components (Est: 6h)
- [ ] Adapt Article component from docs [Est: 1h]
- [ ] Create EntryRenderer component (handles all field types) [Est: 1.5h]
- [ ] Create BlockEditorRenderer (YouTube, Gallery, Quote, etc) [Est: 2h]
- [ ] Create FormBuilder component (dynamic fields from Rush CMS) [Est: 1.5h]

### Sprint #3 - Navigation & Pages (Est: 5h)
- [ ] Create Navigation component (tree structure support) [Est: 1h]
- [ ] Create app/blog/[slug]/page.tsx from docs [Est: 1h]
- [ ] Create app/[slug]/page.tsx for dynamic pages [Est: 1h]
- [ ] Create homepage with featured entries [Est: 1.5h]
- [ ] Create contact page with FormBuilder [Est: 0.5h]

### Sprint #4 - Revalidation & Analytics (Est: 3h)
- [ ] Create app/api/revalidate/route.ts from docs [Est: 0.5h]
- [ ] Add Analytics script loader component [Est: 0.5h]
- [ ] Create meta tags helper for analytics [Est: 0.5h]
- [ ] Document webhook setup for Rush CMS (PHP Observer) [Est: 1h]
- [ ] Test on-demand revalidation flow [Est: 0.5h]

## Medium Priority

### Sprint #5 - SEO & Performance (Est: 4h)
- [ ] Create generateMetadata helpers [Est: 1h]
- [ ] Create app/sitemap.xml route (dynamic from entries) [Est: 1h]
- [ ] Create app/robots.txt route [Est: 0.5h]
- [ ] Add structured data (JSON-LD) for blog posts [Est: 1h]
- [ ] Create OptimizedImage wrapper component [Est: 0.5h]

### Sprint #6 - UI Components Library (Est: 5h)
- [ ] Create components/ui/button.tsx [Est: 0.5h]
- [ ] Create components/ui/card.tsx [Est: 0.5h]
- [ ] Create components/ui/input.tsx [Est: 0.5h]
- [ ] Create components/ui/textarea.tsx [Est: 0.5h]
- [ ] Create components/ui/select.tsx [Est: 0.5h]
- [ ] Create loading skeletons (blog-post, card, form) [Est: 1h]
- [ ] Create error boundaries (not-found, error) [Est: 1h]
- [ ] Document Tailwind theme customization [Est: 0.5h]

### Sprint #7 - Deploy Configs (Est: 3h)
- [ ] Create netlify.toml from docs [Est: 0.5h]
- [ ] Create vercel.json (optional) [Est: 0.5h]
- [ ] Test Netlify deployment [Est: 1h]
- [ ] Test Vercel deployment (optional) [Est: 1h]

## Low Priority / Ideas

### Sprint #8 - Documentation & DX (Est: 4h)
- [ ] Write comprehensive README.md [Est: 2h]
- [ ] Create setup wizard script (interactive .env config) [Est: 1h]
- [ ] Add inline JSDoc comments to all public functions [Est: 0.5h]
- [ ] Create CONTRIBUTING.md [Est: 0.5h]

### Sprint #9 - Advanced Features (Est: 6h)
- [ ] Add search functionality (client-side filtering) [Est: 2h]
- [ ] Add pagination component [Est: 1h]
- [ ] Add breadcrumbs component [Est: 1h]
- [ ] Add share buttons component (social media) [Est: 1h]
- [ ] Add table of contents generator (for long posts) [Est: 1h]

### Sprint #10 - i18n Ready (Est: 3h)
- [ ] Setup next-intl or similar [Est: 1h]
- [ ] Create language switcher component [Est: 1h]
- [ ] Document multi-language setup [Est: 1h]

## Future Ideas (Not Estimated)

### Performance Enhancements
- Add service worker for offline support
- Implement prefetching for blog post links
- Add lazy loading for images below fold
- Implement resource hints (preconnect, dns-prefetch)

### Developer Experience
- Add Storybook for component library
- Add Vitest for unit testing
- Add Playwright for e2e testing
- Add Husky for pre-commit hooks (format, lint, type-check)

### Advanced CMS Features
- Preview mode for draft entries
- Content versioning UI
- Real-time collaborative editing indicator
- Content scheduling calendar view

### Integrations
- Google Analytics 4 integration
- Plausible Analytics integration
- SendGrid/Resend for form emails
- Uploadcare/Cloudinary for media optimization
- Algolia for advanced search

### Templates
- Portfolio template
- E-commerce catalog template
- Real estate listings template
- Job board template
- Restaurant menu template

## Completed Sprints

(Move completed sprints to .claude/completed/YYYY-MM-DD.md)
