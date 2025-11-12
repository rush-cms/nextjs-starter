import { Skeleton } from './skeleton'

interface FormSkeletonProps {
	fieldCount?: number
}

export function FormSkeleton({ fieldCount = 4 }: FormSkeletonProps) {
	return (
		<div className='space-y-6'>
			<div>
				<Skeleton variant='text' className='w-full h-10 sm:h-12 mb-2' />
				<Skeleton variant='text' className='w-3/4 h-10 sm:h-12' />
			</div>

			<div className='space-y-4'>
				{Array.from({ length: fieldCount }).map((_, index) => (
					<div key={index} className='space-y-2'>
						<Skeleton variant='text' className='w-32 h-5' />
						<Skeleton variant='rectangle' className='w-full h-10 sm:h-11' />
					</div>
				))}
			</div>

			<div className='flex gap-3 pt-4'>
				<Skeleton variant='rectangle' className='w-32 h-10 sm:h-11' />
				<Skeleton variant='rectangle' className='w-24 h-10 sm:h-11' />
			</div>
		</div>
	)
}
