'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { logger } from '@/lib/logger'

interface ErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function BlogError({ error, reset }: ErrorProps) {
	useEffect(() => {
		logger.error('blog listing error', {
			message: error.message,
			digest: error.digest
		})
	}, [error])

	return (
		<div className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
			<div className='bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8'>
				<div className='flex flex-col items-center text-center gap-4 sm:gap-6'>
					<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
						<svg
							className='w-8 h-8 text-red-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
							/>
						</svg>
					</div>

					<div>
						<h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>
							Erro ao carregar o blog
						</h2>
						<p className='text-sm sm:text-base text-gray-600 max-w-md mx-auto'>
							Não foi possível carregar a listagem de artigos. Por favor, tente novamente.
						</p>
					</div>

					{process.env.NODE_ENV === 'development' && error.message && (
						<div className='w-full mt-4 p-4 bg-white rounded border border-red-200'>
							<p className='text-xs sm:text-sm text-red-800 font-mono text-left break-all'>
								{error.message}
							</p>
						</div>
					)}

					<div className='flex flex-col sm:flex-row gap-3'>
						<button
							onClick={reset}
							className='inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200'
						>
							Tentar Novamente
						</button>
						<Link
							href='/'
							className='inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-200'
						>
							Voltar ao Início
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
