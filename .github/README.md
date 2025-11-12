# GitHub Actions CI/CD

This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. CI Pipeline (`ci.yml`)
Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
- **Lint**: Runs ESLint to check code quality
- **Type Check**: Runs TypeScript compiler to verify types
- **Test**: Runs Vitest test suite with coverage
- **Build**: Builds the Next.js project

**Status Badge:**
```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
```

### 2. Deploy Preview (`deploy-preview.yml`)
Deploys preview environments for pull requests.

**Triggers:** Pull requests to `main`

**Features:**
- Deploys to Vercel preview URL
- Comments PR with preview link
- Isolated environment per PR

### 3. Deploy Production (`deploy-production.yml`)
Deploys to production on merge to main.

**Triggers:** Push to `main` branch

**Features:**
- Deploys to Vercel production
- Automatic on merge

## Required GitHub Secrets

Configure these secrets in your repository settings:
`Settings > Secrets and variables > Actions > New repository secret`

### For Vercel Deployment

1. **VERCEL_TOKEN**
   - Go to: https://vercel.com/account/tokens
   - Create new token
   - Copy and add as secret

2. **VERCEL_ORG_ID**
   - Run: `vercel link` in your project
   - Find in `.vercel/project.json`
   - Copy `orgId` value

3. **VERCEL_PROJECT_ID**
   - Run: `vercel link` in your project
   - Find in `.vercel/project.json`
   - Copy `projectId` value

4. **VERCEL_DOMAIN** (Optional)
   - Your custom domain
   - Example: `yoursite.com`

### For Code Coverage (Optional)

5. **CODECOV_TOKEN**
   - Go to: https://codecov.io/
   - Add your repository
   - Copy token from settings
   - Add as secret

## Environment Variables

The CI workflow creates a temporary `.env` file with test values.

For production deployment, configure environment variables in:
- Vercel Dashboard > Project > Settings > Environment Variables

Required variables:
- `NEXT_PUBLIC_API_URL`
- `API_TOKEN`
- `SITE_ID`
- `SITE_SLUG`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SITE_URL`
- `BLOG_COLLECTION_ID`
- `PAGES_COLLECTION_ID`
- `NAVIGATION_ID`
- `CONTACT_FORM_KEY`

## Local Development

To test workflows locally, use [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run CI workflow
act push

# Run specific job
act -j lint
act -j test
```

## Troubleshooting

### Build Fails in CI
1. Check that all dependencies are in `package.json`
2. Verify `.env` variables are set correctly
3. Run `pnpm build` locally to reproduce

### Tests Fail in CI
1. Ensure tests pass locally: `pnpm test`
2. Check for environment-specific issues
3. Review test output in Actions logs

### Deploy Fails
1. Verify Vercel secrets are correct
2. Check Vercel dashboard for errors
3. Ensure project is linked: `vercel link`

## Disabling Workflows

To temporarily disable a workflow:
1. Go to Actions tab
2. Select workflow
3. Click "..." menu > Disable workflow

Or comment out the workflow file with:
```yaml
# on:
#   push:
#     branches: [main]
```

## Best Practices

1. **Always run tests locally** before pushing
2. **Use pull requests** for code review
3. **Wait for CI to pass** before merging
4. **Monitor deployments** in Vercel dashboard
5. **Keep secrets secure** - never commit them

## Status Checks

Add branch protection rules:
1. Settings > Branches > Add rule
2. Require status checks to pass:
   - `lint`
   - `typecheck`
   - `test`
   - `build`
3. Require branches to be up to date
4. Include administrators

This ensures no code is merged without passing CI.
