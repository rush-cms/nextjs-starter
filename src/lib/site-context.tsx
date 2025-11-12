'use client'

import { createContext, useContext } from 'react'

interface SiteContextValue {
	name: string
}

const SiteContext = createContext<SiteContextValue>({
	name: 'Rush CMS'
})

export function SiteProvider({
	children,
	name
}: {
	children: React.ReactNode
	name: string
}) {
	return (
		<SiteContext.Provider value={{ name }}>
			{children}
		</SiteContext.Provider>
	)
}

export function useSite() {
	return useContext(SiteContext)
}
