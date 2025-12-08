/**
 * Navigation API - Usage Examples
 *
 * This file demonstrates how to use the new Navigation API
 * following the updated structure without slug and location fields
 */

'use client'

import { useNavigation, useNavigations } from '@rushcms/react'
import Link from 'next/link'

/**
 * Example 1: Fetch a specific navigation by KEY
 * Replace 'main-menu' with your actual navigation key from the admin
 */
export function HeaderMenu() {
	const HEADER_MENU_KEY = 'main-menu'

	const { navigation, loading, error } = useNavigation({
		key: HEADER_MENU_KEY
	})

	if (loading) return <div>Loading menu...</div>
	if (error) return <div>Error loading menu: {error.message}</div>
	if (!navigation) return null

	return (
		<nav className='flex gap-4'>
			{navigation.items.map((item) => (
				<NavigationItem key={item.id} item={item} />
			))}
		</nav>
	)
}

/**
 * Example 2: Fetch all navigations
 * Useful for admin interfaces or selecting which navigation to display
 */
export function NavigationSelector() {
	const { navigations, loading, error } = useNavigations()

	if (loading) return <div>Loading navigations...</div>
	if (error) return <div>Error: {error.message}</div>

	return (
		<div>
			<h2>Available Navigations</h2>
			<ul>
				{navigations.map((nav) => (
					<li key={nav.id}>
						<strong>{nav.name}</strong>
						<code>{nav.key}</code>
						<span>{nav.items.length} items</span>
					</li>
				))}
			</ul>
		</div>
	)
}

/**
 * Example 3: Recursive navigation item renderer
 * Handles navigation items with their pre-computed URLs
 */
function NavigationItem({ item }: { item: any }) {
	return (
		<div>
			<Link
				href={item.url}
				target={item.target || '_self'}
				className='hover:underline'
			>
				{item.title}
			</Link>

			{item.children && item.children.length > 0 && (
				<div className='ml-4 mt-2'>
					{item.children.map((child: any) => (
						<NavigationItem key={child.id} item={child} />
					))}
				</div>
			)}
		</div>
	)
}

/**
 * Example 4: Using the RushCMSClient directly (without hooks)
 * Useful for Server Components or API routes
 */
export async function getNavigationData(key: string) {
	const { RushCMSClient } = await import('@rushcms/client')

	const client = new RushCMSClient({
		baseUrl: process.env.NEXT_PUBLIC_CMS_URL!,
		apiToken: process.env.CMS_API_TOKEN!,
		siteSlug: process.env.NEXT_PUBLIC_SITE_SLUG!
	})

	try {
		const response = await client.getNavigation(key)
		return response.data
	} catch (error) {
		console.error('Error fetching navigation:', error)
		return null
	}
}

/**
 * Example 5: Server Component usage
 */
export async function ServerNavigation({ navKey }: { navKey: string }) {
	const navigation = await getNavigationData(navKey)

	if (!navigation) return <div>Navigation not found</div>

	return (
		<nav>
			<h3>{navigation.name}</h3>
			<ul>
				{navigation.items.map((item) => (
					<li key={item.id}>{item.title}</li>
				))}
			</ul>
		</nav>
	)
}
