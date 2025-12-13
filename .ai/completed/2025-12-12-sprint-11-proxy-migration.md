# Sprint #11 - Migrate Middleware to Proxy (Next.js 16)

**Priority**: High
**Estimated Time**: 1-2 hours
**Status**: NOT APPLICABLE
**Completed**: 2025-11-18
**Reason**: Project does not use middleware - next-intl is only used for string translations, not for i18n routing

## Objective
Migrate from deprecated `middleware.ts` to the new `proxy.ts` file convention introduced in Next.js 16, following official migration guidelines.

---

## Background & Context

### Why This Migration is Necessary
Next.js 16 deprecated the `middleware.ts` file convention in favor of `proxy.ts`. The reasons:

1. **Naming Clarity**: "Middleware" was often confused with Express.js middleware, leading to misuse
2. **Purpose Clarification**: "Proxy" better describes the feature - a network boundary in front of the app
3. **Discourage Overuse**: Next.js wants developers to use middleware/proxy as a last resort
4. **Better Ergonomics**: Next.js is providing better APIs to achieve goals without middleware

### Key Changes in Proxy vs Middleware

| Aspect | Middleware (Old) | Proxy (New) |
|--------|------------------|-------------|
| File name | `middleware.ts` | `proxy.ts` |
| Function name | `export function middleware()` | `export function proxy()` |
| Runtime | Edge Runtime (default) | Node.js Runtime (only) |
| Location | Same (root or `src/`) | Same (root or `src/`) |
| Matcher config | Same syntax | Same syntax |

**CRITICAL**: Proxy runs on Node.js runtime ONLY. Edge runtime is NOT supported. You cannot configure the runtime.

---

## Prerequisites

- Next.js 16+ installed
- Current `middleware.ts` file exists
- Node.js 20+ installed
- Git clean working tree (commit current changes first)

---

## Migration Strategy

### Option A: Automated Migration (Recommended - 10 minutes)

Use Next.js official codemod for automatic migration.

### Option B: Manual Migration (Alternative - 20 minutes)

Manual step-by-step migration if codemod doesn't work or you want full control.

---

## Phase 1: Backup & Preparation (5 minutes)

### Task 1.1: Commit Current State
Ensure all current changes are committed:

```bash
git add -A
git commit -m "chore: backup before middleware to proxy migration"
```

### Task 1.2: Review Current Middleware
Read `src/middleware.ts` to understand current implementation:

```bash
cat src/middleware.ts
```

**Current implementation** (for reference):
```typescript
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
	locales,
	defaultLocale,
	localePrefix: 'as-needed'
})

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

### Task 1.3: Check Next.js Version
Verify you're on Next.js 16+:

```bash
pnpm list next
```

Expected output: `next@16.x.x`

---

## Phase 2: Automated Migration (10 minutes)

### Task 2.1: Run Next.js Codemod
Execute the official migration codemod:

```bash
npx @next/codemod@canary middleware-to-proxy .
```

**What this does:**
1. Renames `src/middleware.ts` → `src/proxy.ts`
2. Renames function `middleware` → `proxy`
3. Updates imports if necessary
4. Preserves all config and logic

### Task 2.2: Verify Changes
Check that files were renamed:

```bash
ls -la src/ | grep -E "(middleware|proxy)"
```

Expected: Only `proxy.ts` should exist (no `middleware.ts`)

### Task 2.3: Review Generated Code
Read the new `src/proxy.ts`:

```bash
cat src/proxy.ts
```

**Expected output:**
```typescript
import createNextIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export function proxy() {
	return createNextIntlMiddleware({
		locales,
		defaultLocale,
		localePrefix: 'as-needed'
	})
}

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

**⚠️ IMPORTANT**: The codemod might not handle `next-intl` correctly. If the output doesn't match expected, proceed to manual fix.

---

## Phase 3: Manual Fixes for next-intl (5-10 minutes)

The codemod doesn't understand that `createMiddleware` from `next-intl` returns a function. We need to adapt it.

### Task 3.1: Update proxy.ts for next-intl
**Problem**: `next-intl`'s `createMiddleware` already returns a middleware function.

**Solution**: Manually update `src/proxy.ts`:

```typescript
import createNextIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

const handleI18nRouting = createNextIntlMiddleware({
	locales,
	defaultLocale,
	localePrefix: 'as-needed'
})

export function proxy(request: Request) {
	return handleI18nRouting(request)
}

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

**Alternative (if using next-intl 4.5.2+)**: Check `next-intl` docs for `createProxyMiddleware` if available.

### Task 3.2: Check next-intl Documentation
Search for official `next-intl` proxy support:

```bash
pnpm why next-intl
```

Visit: https://next-intl-docs.vercel.app/ and search for "Next.js 16" or "proxy"

**Action**: If `next-intl` has released a proxy-specific API, use it. Otherwise, use the wrapper above.

---

## Phase 4: Testing (15-20 minutes)

### Task 4.1: Clear Next.js Cache
Remove build cache to ensure clean build:

```bash
rm -rf .next
```

### Task 4.2: Start Development Server
Test that proxy works in development:

```bash
pnpm dev
```

**Expected**: No errors about middleware deprecation.

### Task 4.3: Test I18n Routing
Open browser and test:

1. **Default locale**: Visit `http://localhost:3000`
   - Should load without `/pt-BR` in URL (localePrefix: 'as-needed')
   - Page should render in Portuguese

2. **English locale**: Visit `http://localhost:3000/en`
   - URL should show `/en`
   - Page should render in English (if translations exist)

3. **Locale detection**: Open incognito with English browser
   - Should detect browser language
   - Might redirect to `/en` or stay on `/` based on config

4. **API routes**: Visit `http://localhost:3000/api/revalidate`
   - Should NOT be processed by proxy (matcher excludes it)
   - Should return API response

5. **Static files**: Visit `http://localhost:3000/favicon.ico`
   - Should load directly (not intercepted by proxy)

### Task 4.4: Build for Production
Test production build:

```bash
pnpm build
```

**Expected output:**
- ✅ No middleware deprecation warnings
- ✅ Build completes successfully
- ✅ All routes compile without errors

**If you see warnings:**
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```
This means migration didn't work. Go back and verify file was renamed.

### Task 4.5: Test Production Server
Run production server:

```bash
pnpm start
```

Test same scenarios as Task 4.3 in production mode.

---

## Phase 5: Update Documentation (5 minutes)

### Task 5.1: Update README.md
If README mentions middleware, update references:

**Find and replace:**
- `middleware.ts` → `proxy.ts`
- "middleware file" → "proxy file"
- "middleware configuration" → "proxy configuration"

### Task 5.2: Update Comments
Search codebase for middleware references:

```bash
grep -r "middleware" --include="*.ts" --include="*.tsx" --include="*.md" .
```

Update any comments or documentation that mention middleware.

### Task 5.3: Update CLAUDE.md (if necessary)
If CLAUDE.md has middleware-specific instructions, update them to proxy.

---

## Phase 6: Verification & Commit (5 minutes)

### Task 6.1: Final Checklist
Verify all migration requirements:

- [ ] `src/middleware.ts` deleted
- [ ] `src/proxy.ts` exists
- [ ] Function named `proxy` (not `middleware`)
- [ ] Development server runs without warnings
- [ ] Production build succeeds without warnings
- [ ] Locale routing works (both pt-BR and en)
- [ ] API routes not intercepted
- [ ] Static files load correctly
- [ ] No references to "middleware" in codebase (except node_modules)

### Task 6.2: Git Status
Check what changed:

```bash
git status
```

Expected changes:
- Deleted: `src/middleware.ts`
- Added: `src/proxy.ts`
- Modified: `README.md` (if updated)

### Task 6.3: Commit Changes
Commit the migration:

```bash
git add -A
git commit -m "refactor: migrate from middleware to proxy for next.js 16 compatibility"
```

**Commit message guidelines** (as per CLAUDE.md):
- Type: `refactor` (changing code structure without changing behavior)
- Scope: Optional, could add `(i18n)` or `(routing)`
- Description: Lowercase, concise, one line only
- No emoji, no "Sprint" references, no multi-line descriptions

### Task 6.4: Push Changes (if applicable)
If working on a branch:

```bash
git push origin main
```

---

## Troubleshooting Guide

### Problem 1: Codemod Not Found
**Error**: `npx @next/codemod@canary middleware-to-proxy: command not found`

**Solution**:
```bash
# Update npx cache
npx clear-npx-cache
# Try again
npx @next/codemod@canary middleware-to-proxy .
```

### Problem 2: Codemod Fails
**Error**: Codemod throws errors during execution

**Solution**: Use manual migration (Phase 3)

### Problem 3: Build Still Shows Warning
**Error**: `⚠ The "middleware" file convention is deprecated`

**Diagnosis**:
```bash
# Check if old file still exists
ls -la src/middleware.ts

# Check if git tracked the rename
git status
```

**Solution**:
```bash
# Force delete old file
rm src/middleware.ts

# Ensure proxy.ts exists
touch src/proxy.ts

# Re-run build
pnpm build
```

### Problem 4: Locale Routing Broken
**Symptom**: Routes return 404 or don't redirect properly

**Diagnosis**:
```bash
# Check proxy.ts content
cat src/proxy.ts

# Check matcher configuration
grep "matcher" src/proxy.ts
```

**Solution**:
- Verify `matcher` excludes API routes: `(?!api|_next|...)`
- Verify `next-intl` integration is correct
- Check `i18n/config.ts` exports are valid

### Problem 5: TypeScript Errors
**Error**: `Type 'Request' is not assignable to parameter of type 'NextRequest'`

**Solution**: Import correct types:
```typescript
import { type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
	// ...
}
```

### Problem 6: next-intl Integration Issues
**Error**: `TypeError: handleI18nRouting is not a function`

**Solution**: Check `next-intl` version and docs:
```bash
pnpm update next-intl
```

Update proxy.ts based on latest next-intl API.

---

## Alternative: If Migration Fails Completely

If automated and manual migrations both fail, consider this temporary workaround:

### Temporary Solution (Not Recommended for Production)
Keep `middleware.ts` until Next.js 17 (when it's fully removed):

```typescript
// src/middleware.ts
// @ts-ignore - deprecated but still functional
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
	locales,
	defaultLocale,
	localePrefix: 'as-needed'
})

export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

Add comment explaining it's temporary and create a task to fix before Next.js 17.

---

## Definition of Done

- [ ] `src/middleware.ts` deleted
- [ ] `src/proxy.ts` exists with correct implementation
- [ ] Function exported as `proxy` (not `middleware`)
- [ ] Proxy runs on Node.js runtime
- [ ] Development server runs without deprecation warnings
- [ ] Production build succeeds without warnings
- [ ] All locale routes work (pt-BR and en)
- [ ] API routes not intercepted by proxy
- [ ] Static files load correctly
- [ ] Documentation updated (README, comments)
- [ ] Changes committed with message: `refactor: migrate from middleware to proxy for next.js 16 compatibility`
- [ ] Tests pass (if tests exist): `pnpm test`

---

## Post-Migration Optimization (Optional)

### Consider These Improvements:

1. **Remove proxy entirely** if only using for i18n:
   - Next.js 16 has better i18n APIs
   - Check if `next-intl` v5+ has App Router native support
   - Migrate to `generateStaticParams` for static routes

2. **Simplify matcher**:
   - Review what paths actually need i18n
   - Exclude more paths for better performance

3. **Add logging** (development only):
```typescript
export function proxy(request: NextRequest) {
	if (process.env.NODE_ENV === 'development') {
		console.log('[Proxy]', request.nextUrl.pathname)
	}
	return handleI18nRouting(request)
}
```

---

## Resources

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Proxy File Convention Docs](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Migration Guide](https://nextjs.org/docs/messages/middleware-to-proxy)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

---

## Success Criteria

✅ No deprecation warnings in console
✅ Proxy file follows Next.js 16 conventions
✅ All i18n routing works correctly
✅ Build and deployment successful
✅ Code follows project standards (CLAUDE.md)
✅ Commit message is atomic and follows guidelines
✅ Documentation updated

---

## Estimated Timeline

| Phase | Time | Description |
|-------|------|-------------|
| Phase 1 | 5 min | Backup & preparation |
| Phase 2 | 10 min | Automated migration |
| Phase 3 | 10 min | Manual fixes for next-intl |
| Phase 4 | 20 min | Testing (dev + prod) |
| Phase 5 | 5 min | Update documentation |
| Phase 6 | 5 min | Verification & commit |
| **Total** | **55 min** | **~1 hour** |

Add 30-60 minutes buffer for troubleshooting if issues arise.

---

## Notes for Future Developers

- The `proxy` convention is meant to be used **sparingly**
- Next.js recommends finding alternative solutions before using proxy
- Consider using Server Components, Route Handlers, or other Next.js features instead
- Proxy adds latency to every request, so keep logic minimal
- For i18n, monitor `next-intl` for native App Router support in future versions
