import Link from 'next/link'

export default function NotFound() {
	return (
		<div className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
			<div className='flex flex-col items-center justify-center min-h-[400px] text-center gap-4 sm:gap-6'>
				<div className='text-6xl sm:text-8xl font-bold text-gray-300'>404</div>
				<div>
					<h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3'>
						Página não encontrada
					</h1>
					<p className='text-base sm:text-lg text-gray-600 max-w-md mx-auto'>
						A página que você está procurando não existe ou foi removida.
					</p>
				</div>
				<Link
					href='/'
					className='inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
				>
					Voltar para o Início
				</Link>
			</div>
		</div>
	)
}
