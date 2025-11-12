# Contributing to Next.js Rush CMS Starter

Thank you for considering contributing to this project! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

Be respectful, inclusive, and professional. We welcome contributions from everyone.

## Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/rush-cms-nextjs-starter.git
cd rush-cms-nextjs-starter
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Create Environment File

```bash
cp .env.example .env
```

Configure your `.env` file with your Rush CMS instance details.

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
# Feature branch
git checkout -b feature/amazing-feature

# Bug fix branch
git checkout -b bugfix/fix-something

# Documentation branch
git checkout -b docs/improve-readme
```

### Making Changes

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Run type checking: `pnpm type-check`
4. Run linting: `pnpm lint`
5. Commit your changes (see [Commit Guidelines](#commit-guidelines))

## Code Standards

This project follows strict code standards defined in `CLAUDE.md`:

### Mandatory Rules

1. **Single quotes (`'`)** - NEVER use double quotes
2. **Tabs for indentation** - Tab size = 4
3. **NO semicolons** - Never add semicolons at end of lines
4. **Kebab-case filenames** - `blog-card.tsx` not `BlogCard.tsx`
5. **English only** - All code, comments, and documentation in English
6. **NO inline comments** - Comments must be on their own line
7. **Tailwind CSS only** - No custom CSS unless absolutely necessary
8. **Strong typing** - No `any` types, strict TypeScript
9. **Mobile-first approach** - Always design for mobile first

### Examples

#### ✅ Correct

```typescript
const message = 'Hello World'
const config = {
	name: 'TechRadar',
	version: '1.0.0'
}

// This is a good comment
function doSomething() {
	return true
}
```

#### ❌ Wrong

```typescript
const message = "Hello World";  // Wrong: double quotes, semicolon
const config = {
    name: "TechRadar",  // Wrong: spaces instead of tabs
    version: "1.0.0", // Wrong: trailing comma
};

function doSomething() { // Wrong: inline comment
    return true;
}
```

### TypeScript

- Use strict type safety
- No `any` types
- Define proper interfaces/types
- Use generics where appropriate

```typescript
// ✅ Good
interface BlogCardProps {
	entry: RushCMSEntry<BlogEntryData>
	formatDate: (date: string) => string
}

// ❌ Bad
interface BlogCardProps {
	entry: any
	formatDate: Function
}
```

### Component Structure

```typescript
'use client'  // Only if component needs client-side features

import { useState } from 'react'
import type { ComponentProps } from '@/types'

interface MyComponentProps {
	title: string
	children: React.ReactNode
}

export function MyComponent({ title, children }: MyComponentProps) {
	const [state, setState] = useState(false)

	return (
		<div className='container mx-auto'>
			<h1 className='text-2xl font-bold'>{title}</h1>
			{children}
		</div>
	)
}
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) with lowercase format:

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring (no functional changes)
- `docs` - Documentation changes
- `style` - Formatting, missing semicolons, etc (no code change)
- `test` - Adding tests
- `chore` - Dependencies, build, tooling
- `perf` - Performance improvements

### Examples

```bash
feat(blog): add pagination component
fix(api): resolve rate limiting issue
docs(readme): update installation instructions
refactor(components): simplify blog card logic
style(format): apply prettier formatting
test(api): add rush cms client tests
chore(deps): update next.js to 16.0.0
perf(images): optimize image loading
```

### Rules

- Use lowercase for type and description
- Keep description under 72 characters
- Use imperative mood ("add" not "added")
- Don't end with a period
- Be specific but concise

## Pull Request Process

### 1. Update Your Branch

```bash
git checkout main
git pull upstream main
git checkout your-feature-branch
git rebase main
```

### 2. Push Your Changes

```bash
git push origin your-feature-branch
```

### 3. Create Pull Request

1. Go to GitHub and create a Pull Request
2. Fill out the PR template
3. Link any related issues
4. Request review from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] Type checking passed (`pnpm type-check`)
- [ ] Linting passed (`pnpm lint`)
- [ ] No console errors in browser

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows CLAUDE.md guidelines
- [ ] Commit messages follow conventional commits
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or documented)
```

### Review Process

- All PRs require at least one approval
- Address review comments
- Keep PR focused (one feature/fix per PR)
- Update PR based on feedback

## Testing

### Type Checking

```bash
pnpm type-check
```

Must pass with zero errors before submitting PR.

### Linting

```bash
pnpm lint
```

Fix all linting errors and warnings.

### Manual Testing

Test your changes in the browser:

1. Run development server: `pnpm dev`
2. Test all affected pages
3. Check mobile responsiveness
4. Verify no console errors
5. Test with different data scenarios

### Test Checklist

- [ ] Works on Chrome
- [ ] Works on Firefox
- [ ] Works on Safari
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Accessible (keyboard navigation, screen readers)

## Documentation

### When to Update Documentation

- New features
- API changes
- Environment variables changes
- Configuration changes
- Breaking changes

### Documentation Files

- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guides
- `CONTRIBUTING.md` - This file
- `CLAUDE.md` - Code guidelines
- JSDoc comments for complex functions

### JSDoc Example

```typescript
/**
 * Fetches entries from Rush CMS API
 *
 * @param siteSlug - The site slug from Rush CMS
 * @param collectionId - The collection ID to fetch from
 * @param params - Optional query parameters
 * @returns Promise with array of entries
 * @throws Error if API request fails
 *
 * @example
 * ```typescript
 * const posts = await getEntries('my-site', 1, { status: 'published' })
 * ```
 */
export async function getEntries<T extends Record<string, unknown>>(
	siteSlug: string,
	collectionId: number | string,
	params?: Record<string, unknown>
): Promise<RushCMSEntry<T>[]> {
	// Implementation
}
```

## Project-Specific Guidelines

### Adding New Components

1. Create component in appropriate directory
2. Use TypeScript with proper types
3. Make it generic when possible
4. Add JSDoc comments
5. Follow CLAUDE.md guidelines
6. Test thoroughly

### Adding New Features

1. Discuss in GitHub issues first
2. Create feature branch
3. Implement feature
4. Add documentation
5. Test thoroughly
6. Submit PR

### Fixing Bugs

1. Create bug report issue (if doesn't exist)
2. Create bugfix branch
3. Write failing test (if applicable)
4. Fix the bug
5. Verify test passes
6. Submit PR with issue reference

## Questions?

- Open an issue for questions
- Join discussions on GitHub
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
