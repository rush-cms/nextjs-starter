import { Skeleton } from './skeleton'

export function CardSkeleton() {
	return (
		<div className='bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200'>
			<Skeleton variant='card' className='w-full h-48' />

			<div className='p-4 sm:p-6'>
				<div className='mb-3'>
					<Skeleton variant='text' className='w-20 h-5 rounded-full' />
				</div>

				<Skeleton variant='text' className='w-full h-7 mb-2' />
				<Skeleton variant='text' className='w-5/6 h-7 mb-3 sm:mb-4' />

				<div className='space-y-2 mb-4'>
					<Skeleton variant='text' className='w-full h-4' />
					<Skeleton variant='text' className='w-full h-4' />
					<Skeleton variant='text' className='w-4/5 h-4' />
				</div>

				<div className='flex items-center justify-between pt-4 border-t border-gray-100'>
					<Skeleton variant='text' className='w-24 h-4' />
					<Skeleton variant='text' className='w-20 h-8' />
				</div>
			</div>
		</div>
	)
}
