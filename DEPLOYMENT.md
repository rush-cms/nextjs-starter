# Deployment Guide

This guide covers deploying your Next.js Rush CMS application to Netlify or Vercel.

## Prerequisites

- Rush CMS backend running and accessible
- Git repository hosted on GitHub, GitLab, or Bitbucket
- Netlify or Vercel account

## Environment Variables

Both platforms require the following environment variables:

### Required Variables

```bash
# Rush CMS API Configuration
RUSH_CMS_API_URL=https://your-rush-cms.com/api/v1
RUSH_CMS_API_TOKEN=your-secret-api-token

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site.com

# Revalidation Secret (for on-demand ISR)
REVALIDATE_SECRET=your-random-secret-string
```

### Optional Analytics Variables

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

## Deploying to Netlify

### 1. Connect Repository

1. Log in to [Netlify](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository

### 2. Configure Build Settings

Netlify will auto-detect settings from `netlify.toml`, but verify:

- **Build command**: `pnpm build`
- **Publish directory**: `.next`
- **Node version**: `20`

### 3. Add Environment Variables

Go to **Site settings** → **Build & deploy** → **Environment variables**

Add all required environment variables listed above.

### 4. Deploy

Click **Deploy site**. Netlify will:
1. Install dependencies with pnpm
2. Build your Next.js app
3. Deploy to a global CDN
4. Provide a URL (e.g., `https://your-site.netlify.app`)

### 5. Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration instructions

### 6. Webhook for On-Demand Revalidation

To enable on-demand revalidation from Rush CMS:

1. Get your revalidation endpoint: `https://your-site.netlify.app/api/revalidate`
2. Configure Rush CMS webhook:
   - URL: `https://your-site.netlify.app/api/revalidate`
   - Secret: Same as `REVALIDATE_SECRET`
   - Events: `entry.published`, `entry.updated`, `entry.deleted`

## Deploying to Vercel

### 1. Connect Repository

1. Log in to [Vercel](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your Git repository

### 2. Configure Build Settings

Vercel auto-detects Next.js projects:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)

### 3. Add Environment Variables

During import or later in **Project Settings** → **Environment Variables**

Add all required environment variables listed above.

### 4. Deploy

Click **Deploy**. Vercel will:
1. Install dependencies
2. Build your application
3. Deploy to Vercel Edge Network
4. Provide a URL (e.g., `https://your-site.vercel.app`)

### 5. Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed

### 6. Webhook for On-Demand Revalidation

Configure in Rush CMS:
- URL: `https://your-site.vercel.app/api/revalidate`
- Secret: Same as `REVALIDATE_SECRET`
- Events: `entry.published`, `entry.updated`, `entry.deleted`

## Security Headers

Both `netlify.toml` and `vercel.json` include security headers:

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy
- `Permissions-Policy` - Disables unused browser features
- `Strict-Transport-Security` (Netlify only) - HTTPS enforcement

## Cache Configuration

Static assets are cached for 1 year:
- JavaScript files (`*.js`)
- CSS files (`*.css`)
- Images (`/images/*`)
- Next.js static assets (`/_next/static/*`)

## Testing Deployment

After deployment, verify:

1. **Homepage loads** - Check `/`
2. **Blog listing works** - Check `/blog`
3. **Blog posts load** - Check `/blog/[slug]`
4. **Search works** - Try searching on `/blog`
5. **Pagination works** - Navigate pages
6. **Share buttons work** - Test social sharing
7. **Dynamic pages load** - Check `/[slug]`
8. **404 page renders** - Visit non-existent URL
9. **API revalidation** - Test webhook from Rush CMS

## Troubleshooting

### Build Fails

- **Check Node version**: Must be 20+
- **Check environment variables**: All required vars set?
- **Check build logs**: Look for TypeScript errors
- **Test locally**: Run `pnpm build` locally first

### Images Not Loading

- **Check RUSH_CMS_API_URL**: Must be accessible from build environment
- **Check image URLs**: Verify S3/Spaces URLs are public

### Revalidation Not Working

- **Check webhook URL**: Must be publicly accessible
- **Check secret**: Must match `REVALIDATE_SECRET`
- **Check Rush CMS webhook config**: Events and URL correct?

### Slow Build Times

- **Enable caching**: Both platforms cache `node_modules` and `.next`
- **Check API calls**: Minimize API calls during build
- **Use ISR**: Generate only popular pages at build time

## Performance Tips

1. **Enable ISR**: Use `revalidate` in `getStaticProps`
2. **Optimize images**: Use Next.js Image component
3. **Minimize API calls**: Cache data where possible
4. **Use CDN**: Both platforms provide global CDN
5. **Enable compression**: Enabled by default on both platforms

## Cost Considerations

### Netlify
- **Free tier**: 300 build minutes/month, 100GB bandwidth
- **Pro**: $19/month - 1000 build minutes, 1TB bandwidth

### Vercel
- **Hobby (Free)**: Unlimited personal projects, 100GB bandwidth
- **Pro**: $20/month - Commercial projects, 1TB bandwidth

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Next Steps

After deployment:
1. Set up custom domain
2. Configure SSL certificate (automatic on both platforms)
3. Enable monitoring and analytics
4. Set up Rush CMS webhook
5. Test on-demand revalidation
6. Monitor build times and bandwidth usage
