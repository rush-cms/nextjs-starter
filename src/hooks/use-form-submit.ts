'use client'

import { useState } from 'react'
import type { RushCMSFormSubmission, RushCMSFormSubmissionResponse } from '@/types/rush-cms'

interface UseFormSubmitOptions {
	siteSlug: string
	formKey: string
}

interface UseFormSubmitReturn {
	submit: (submission: RushCMSFormSubmission) => Promise<void>
	loading: boolean
	error: Error | null
	success: boolean
	data: RushCMSFormSubmissionResponse | null
	reset: () => void
}

export function useFormSubmit(
	options: UseFormSubmitOptions
): UseFormSubmitReturn {
	const { siteSlug, formKey } = options

	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<Error | null>(null)
	const [success, setSuccess] = useState<boolean>(false)
	const [data, setData] = useState<RushCMSFormSubmissionResponse | null>(null)

	const submit = async (submission: RushCMSFormSubmission) => {
		setLoading(true)
		setError(null)
		setSuccess(false)
		setData(null)

		try {
			const url = `/api/rush-cms/forms/${siteSlug}/${formKey}/submit`

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(submission)
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => null)
				throw new Error(
					errorData?.message || `HTTP error! status: ${response.status}`
				)
			}

			const result = await response.json()
			setData(result)
			setSuccess(true)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error occurred'))
			setSuccess(false)
		} finally {
			setLoading(false)
		}
	}

	const reset = () => {
		setLoading(false)
		setError(null)
		setSuccess(false)
		setData(null)
	}

	return {
		submit,
		loading,
		error,
		success,
		data,
		reset
	}
}
