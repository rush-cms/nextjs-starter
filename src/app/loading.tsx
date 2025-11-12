export default function Loading() {
	return (
		<div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
			<div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
				<div className='relative w-16 h-16'>
					<div className='absolute inset-0 border-4 border-blue-200 rounded-full'></div>
					<div className='absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin'></div>
				</div>
				<p className='text-base sm:text-lg text-gray-600 font-medium'>
					Carregando...
				</p>
			</div>
		</div>
	)
}
