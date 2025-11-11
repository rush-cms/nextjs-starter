const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_TOKEN = process.env.API_TOKEN
const SITE_ID = process.env.SITE_ID || '1'

interface TestResult {
	name: string
	status: 'success' | 'error'
	message: string
	data?: unknown
}

const results: TestResult[] = []

function logResult(result: TestResult) {
	results.push(result)
	const icon = result.status === 'success' ? '✅' : '❌'
	console.log(`${icon} ${result.name}`)
	console.log(`   ${result.message}`)
	if (result.data) {
		console.log(`   Data:`, result.data)
	}
	console.log()
}

async function testConnection() {
	console.log('🧪 Testing Rush CMS API Connection...\n')
	console.log(`📍 API URL: ${API_URL}`)
	console.log(`🔑 Token: ${API_TOKEN ? '***' + API_TOKEN.slice(-4) : 'NOT SET'}`)
	console.log(`🏢 Site ID: ${SITE_ID}\n`)

	if (!API_URL) {
		logResult({
			name: 'Environment Check',
			status: 'error',
			message: 'NEXT_PUBLIC_API_URL is not set in .env'
		})
		return
	}

	if (!API_TOKEN) {
		logResult({
			name: 'Environment Check',
			status: 'error',
			message: 'API_TOKEN is not set in .env'
		})
		return
	}

	logResult({
		name: 'Environment Check',
		status: 'success',
		message: 'All environment variables are configured'
	})

	try {
		const response = await fetch(`${API_URL}/api/v1/teams`, {
			headers: {
				'Authorization': `Bearer ${API_TOKEN}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-Site-ID': SITE_ID
			}
		})

		if (!response.ok) {
			const error = await response.json().catch(() => null)
			logResult({
				name: 'API Connection',
				status: 'error',
				message: `HTTP ${response.status}: ${response.statusText}`,
				data: error
			})
			return
		}

		const data = await response.json()
		logResult({
			name: 'API Connection',
			status: 'success',
			message: 'Successfully connected to Rush CMS API',
			data: {
				sites: data.data?.length || 0,
				siteNames: data.data?.map((s: any) => s.name) || []
			}
		})

		if (data.data && data.data.length > 0) {
			const site = data.data[0]
			const siteSlug = site.slug

			const collectionsResponse = await fetch(
				`${API_URL}/api/v1/${siteSlug}/collections`,
				{
					headers: {
						'Authorization': `Bearer ${API_TOKEN}`,
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'X-Site-ID': SITE_ID
					}
				}
			)

			if (collectionsResponse.ok) {
				const collectionsData = await collectionsResponse.json()
				logResult({
					name: 'Collections Endpoint',
					status: 'success',
					message: `Found ${collectionsData.data?.length || 0} collections`,
					data: collectionsData.data?.map((c: any) => ({
						name: c.name,
						slug: c.slug,
						entries: c.entries_count || 0
					}))
				})

				if (collectionsData.data && collectionsData.data.length > 0) {
					const collection = collectionsData.data[0]

					const entriesResponse = await fetch(
						`${API_URL}/api/v1/${siteSlug}/collections/${collection.id}/entries`,
						{
							headers: {
								'Authorization': `Bearer ${API_TOKEN}`,
								'Content-Type': 'application/json',
								'Accept': 'application/json',
								'X-Site-ID': SITE_ID
							}
						}
					)

					if (entriesResponse.ok) {
						const entriesData = await entriesResponse.json()
						logResult({
							name: 'Entries Endpoint',
							status: 'success',
							message: `Found ${entriesData.data?.length || 0} entries in "${collection.name}"`,
							data: entriesData.data?.slice(0, 3).map((e: any) => ({
								title: e.title,
								slug: e.slug,
								status: e.status
							}))
						})
					} else {
						logResult({
							name: 'Entries Endpoint',
							status: 'error',
							message: `HTTP ${entriesResponse.status}: ${entriesResponse.statusText}`
						})
					}
				}
			} else {
				logResult({
					name: 'Collections Endpoint',
					status: 'error',
					message: `HTTP ${collectionsResponse.status}: ${collectionsResponse.statusText}`
				})
			}

			const navsResponse = await fetch(
				`${API_URL}/api/v1/${siteSlug}/navigations`,
				{
					headers: {
						'Authorization': `Bearer ${API_TOKEN}`,
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'X-Site-ID': SITE_ID
					}
				}
			)

			if (navsResponse.ok) {
				const navsData = await navsResponse.json()
				logResult({
					name: 'Navigations Endpoint',
					status: 'success',
					message: `Found ${navsData.data?.length || 0} navigations`,
					data: navsData.data?.map((n: any) => ({
						name: n.name,
						slug: n.slug,
						location: n.location
					}))
				})
			} else {
				logResult({
					name: 'Navigations Endpoint',
					status: 'error',
					message: `HTTP ${navsResponse.status}: ${navsResponse.statusText}`
				})
			}
		}
	} catch (error) {
		logResult({
			name: 'API Connection',
			status: 'error',
			message: error instanceof Error ? error.message : 'Unknown error'
		})
	}

	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
	const successCount = results.filter(r => r.status === 'success').length
	const errorCount = results.filter(r => r.status === 'error').length
	console.log(`\n📊 Test Summary: ${successCount} passed, ${errorCount} failed\n`)

	if (errorCount > 0) {
		console.log('❌ Some tests failed. Please check your configuration.')
		process.exit(1)
	} else {
		console.log('✅ All tests passed! Rush CMS API is ready to use.')
		process.exit(0)
	}
}

testConnection().catch(error => {
	console.error('💥 Fatal error:', error)
	process.exit(1)
})
