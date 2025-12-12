'use client'

import { useEffect, useState } from 'react'
import { LuSearch, LuX } from 'react-icons/lu'

interface SearchInputProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	debounceMs?: number
}

export function SearchInput({
	value,
	onChange,
	placeholder = 'Search...',
	debounceMs = 300
}: SearchInputProps) {
	const [localValue, setLocalValue] = useState(value)

	useEffect(() => {
		setLocalValue(value)
	}, [value])

	useEffect(() => {
		const timer = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue)
			}
		}, debounceMs)

		return () => clearTimeout(timer)
	}, [localValue, value, onChange, debounceMs])

	const handleClear = () => {
		setLocalValue('')
		onChange('')
	}

	return (
		<div className='relative w-full'>
			<div className='relative'>
				<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
					<LuSearch className='w-5 h-5 text-gray-400' />
				</div>
				<input
					type='text'
					value={localValue}
					onChange={(e) => setLocalValue(e.target.value)}
					placeholder={placeholder}
					className='w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow'
					aria-label='Search'
				/>
				{localValue && (
					<button
						onClick={handleClear}
						className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors'
						aria-label='Clear search'
					>
						<LuX className='w-5 h-5' />
					</button>
				)}
			</div>
		</div>
	)
}
