'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { useFormSubmit } from '@/hooks/use-form-submit'
import type { RushCMSForm, RushCMSFormField } from '@/types/rush-cms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

interface FormBuilderProps {
	form: RushCMSForm
	siteSlug: string
	className?: string
}

function renderField(field: RushCMSFormField, value: string, onChange: (value: string) => void) {
	const { type, config, validation } = field
	const isRequired = validation?.is_required || false

	const baseClass = 'w-full'

	switch (type) {
		case 'text':
		case 'email':
		case 'number':
			return (
				<Input
					type={type}
					name={config.name}
					placeholder={config.placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					required={isRequired}
					className={baseClass}
				/>
			)

		case 'textarea':
			return (
				<Textarea
					name={config.name}
					placeholder={config.placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					required={isRequired}
					rows={4}
					className={baseClass}
				/>
			)

		case 'select':
			return (
				<Select value={value} onValueChange={onChange} required={isRequired}>
					<SelectTrigger className={baseClass}>
						<SelectValue placeholder={config.placeholder || 'Selecione...'} />
					</SelectTrigger>
					<SelectContent>
						{config.options?.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)

		case 'checkbox':
			return (
				<div className='space-y-2'>
					{config.options?.map((option) => (
						<label key={option.value} className='flex items-center gap-2 cursor-pointer'>
							<input
								type='checkbox'
								name={config.name}
								value={option.value}
								checked={value.includes(option.value)}
								onChange={(e) => {
									const values = value ? value.split(',') : []
									if (e.target.checked) {
										onChange([...values, option.value].join(','))
									} else {
										onChange(values.filter(v => v !== option.value).join(','))
									}
								}}
								className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
							/>
							<span className='text-sm sm:text-base text-gray-700'>{option.label}</span>
						</label>
					))}
				</div>
			)

		case 'radio':
			return (
				<div className='space-y-2'>
					{config.options?.map((option) => (
						<label key={option.value} className='flex items-center gap-2 cursor-pointer'>
							<input
								type='radio'
								name={config.name}
								value={option.value}
								checked={value === option.value}
								onChange={(e) => onChange(e.target.value)}
								required={isRequired}
								className='w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500'
							/>
							<span className='text-sm sm:text-base text-gray-700'>{option.label}</span>
						</label>
					))}
				</div>
			)

		default:
			return null
	}
}

export function FormBuilder({ form, siteSlug, className = '' }: FormBuilderProps) {
	const t = useTranslations('form')
	const [formData, setFormData] = useState<Record<string, string>>({})
	const { submit, loading, error, success, reset } = useFormSubmit({
		siteSlug,
		formKey: form.key
	})

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await submit({
			data: formData
		})
	}

	const handleFieldChange = (fieldName: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[fieldName]: value
		}))
	}

	if (success) {
		return (
			<div className={`w-full max-w-2xl mx-auto p-4 sm:p-6 ${className}`}>
				<div className='rounded-lg bg-green-50 border border-green-200 p-4 sm:p-6'>
					<div className='flex items-start gap-3'>
						<div className='flex-shrink-0'>
							<svg className='w-5 h-5 sm:w-6 sm:h-6 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
								<path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
							</svg>
						</div>
						<div className='flex-1'>
							<h3 className='text-base sm:text-lg font-medium text-green-900 mb-1'>
								{t('success')}
							</h3>
							<p className='text-sm sm:text-base text-green-700'>
								Obrigado pelo contato. Retornaremos em breve.
							</p>
						</div>
					</div>
					<Button
						onClick={reset}
						variant='outline'
						className='mt-4 w-full sm:w-auto'
					>
						{t('submit')}
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className={`w-full max-w-2xl mx-auto p-4 sm:p-6 ${className}`}>
			{form.description && (
				<p className='text-sm sm:text-base text-gray-600 mb-6 sm:mb-8'>
					{form.description}
				</p>
			)}

			<form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
				{form.fields.map((field) => (
					<div key={field.config.name} className='space-y-2'>
						<Label htmlFor={field.config.name} className='text-sm sm:text-base font-medium text-gray-900'>
							{field.config.label}
							{field.validation?.is_required && (
								<span className='text-red-600 ml-1'>*</span>
							)}
						</Label>
						{renderField(
							field,
							formData[field.config.name] || '',
							(value) => handleFieldChange(field.config.name, value)
						)}
					</div>
				))}

				{error && (
					<div className='rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4'>
						<p className='text-sm sm:text-base text-red-800'>{error.message}</p>
					</div>
				)}

				<Button
					type='submit'
					disabled={loading}
					className='w-full sm:w-auto min-w-32'
				>
					{loading ? t('sending') : t('submit')}
				</Button>
			</form>
		</div>
	)
}
