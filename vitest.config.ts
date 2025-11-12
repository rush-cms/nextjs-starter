import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			include: [
				'src/**/*.{ts,tsx}'
			],
			exclude: [
				'src/**/*.d.ts',
				'src/**/*.stories.{ts,tsx}',
				'src/app/**/layout.tsx',
				'src/app/**/loading.tsx',
				'src/proxy.ts',
				'src/i18n/**'
			],
			thresholds: {
				branches: 90,
				functions: 90,
				lines: 90,
				statements: 90
			}
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		}
	}
})
