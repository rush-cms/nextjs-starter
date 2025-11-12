import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.digitaloceanspaces.com',
				pathname: '/**'
			},
			{
				protocol: 'https',
				hostname: '**.s3.amazonaws.com',
				pathname: '/**'
			},
			{
				protocol: 'https',
				hostname: '**.s3.*.amazonaws.com',
				pathname: '/**'
			},
			{
				protocol: 'https',
				hostname: '**.cloudfront.net',
				pathname: '/**'
			}
		],
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://plausible.io",
							"style-src 'self' 'unsafe-inline'",
							"img-src 'self' data: https: blob:",
							"font-src 'self' data:",
							"connect-src 'self' https://www.google-analytics.com https://plausible.io",
							"frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
							"object-src 'none'",
							"base-uri 'self'",
							"form-action 'self'",
							"frame-ancestors 'none'",
							"upgrade-insecure-requests"
						].join('; ')
					},
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on'
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=31536000; includeSubDomains; preload'
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY'
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block'
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin'
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()'
					}
				]
			}
		]
	}
}

export default nextConfig
