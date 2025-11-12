import { Skeleton } from './skeleton'

export function BlogPostSkeleton() {
	return (
		<article className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
			<div className='mb-3 sm:mb-4'>
				<Skeleton variant='text' className='w-20 h-6' />
			</div>

			<Skeleton variant='text' className='w-full h-10 sm:h-12 lg:h-14 mb-2' />
			<Skeleton variant='text' className='w-3/4 h-10 sm:h-12 lg:h-14 mb-4 sm:mb-6' />

			<div className='flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8'>
				<Skeleton variant='text' className='w-32 h-4' />
				<Skeleton variant='text' className='w-32 h-4' />
			</div>

			<Skeleton variant='card' className='w-full h-48 sm:h-64 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10' />

			<div className='space-y-4'>
				<Skeleton variant='text' className='w-full h-4' />
				<Skeleton variant='text' className='w-full h-4' />
				<Skeleton variant='text' className='w-5/6 h-4' />
				<Skeleton variant='text' className='w-full h-4' />
				<Skeleton variant='text' className='w-full h-4' />
				<Skeleton variant='text' className='w-4/5 h-4' />
			</div>

			<div className='mt-6 sm:mt-8 space-y-4'>
				<Skeleton variant='text' className='w-full h-4' />
				<Skeleton variant='text' className='w-full h-4' />
				<Skeleton variant='text' className='w-3/4 h-4' />
			</div>

			<div className='flex flex-wrap gap-2 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-200'>
				<Skeleton variant='text' className='w-16 h-6' />
				<Skeleton variant='text' className='w-20 h-6 rounded-full' />
				<Skeleton variant='text' className='w-24 h-6 rounded-full' />
				<Skeleton variant='text' className='w-20 h-6 rounded-full' />
			</div>
		</article>
	)
}
