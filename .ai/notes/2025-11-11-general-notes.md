# Notes - Quick Thoughts & Ideas

## Blockers

No blockers at the moment.

## Decisions Pending

- [ ] [2025-11-11] Choose UI component library or build from scratch?
  - Options: Shadcn/ui, Headless UI, Radix UI, or custom Tailwind
  - Impact: DX, bundle size, customization flexibility
  - Recommendation: Start custom, add Shadcn/ui if user requests

- [ ] [2025-11-11] Form validation library?
  - Options: Zod, Yup, React Hook Form, or manual
  - Impact: Bundle size, type safety, DX
  - Recommendation: Zod + React Hook Form (best TS integration)

- [ ] [2025-11-11] Analytics beyond Rush CMS built-in?
  - Options: Google Analytics 4, Plausible, Fathom
  - Impact: Privacy, compliance, features
  - Recommendation: Keep optional, document integration

- [ ] [2025-11-11] Authentication for preview mode?
  - Rush CMS API returns only published entries
  - Need preview mode for draft content?
  - Recommendation: Add in Sprint #9 (Advanced Features)

## Ideas for Future

- [2025-11-11] **Dark mode toggle** - Use CSS variables from globals.css, add toggle component
- [2025-11-11] **Reading time calculator** - Calculate from entry content length
- [2025-11-11] **Related posts** - Client-side matching by tags/category
- [2025-11-11] **RSS feed** - Generate from entries API
- [2025-11-11] **Email capture component** - Integrate with form builder
- [2025-11-11] **Copy code button** - For code blocks in rich text
- [2025-11-11] **Image zoom on click** - For gallery and images
- [2025-11-11] **Print-friendly styles** - CSS for print media

## Technical Debt

None yet - greenfield project.

## Learnings & Insights

- [2025-11-11] Rush CMS API is well-designed with proper caching headers
- [2025-11-11] Next.js 16 + ISR + webhooks = perfect for headless CMS
- [2025-11-11] TypeScript strict mode catches errors early (keep it!)
- [2025-11-11] Tailwind v4 with postcss plugin is cleaner than v3

## Questions for User

None at the moment.

## External Dependencies

- Rush CMS API (backend)
- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript 5

## Performance Targets

- TTFB: < 50ms (SSG/ISR)
- LCP: < 1s
- CLS: 0
- FID: < 100ms
- Lighthouse Score: 95+
- Bundle size: < 200KB initial load

## Browser Support

- Modern browsers (last 2 versions)
- ES2020+ (Next.js default)
- No IE11 support needed
