import { getForm } from '@/lib/rush-cms'
import { FormBuilder } from '@/components/rush/form-builder'
import { config } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Contato',
	description: 'Entre em contato conosco'
}

export default async function ContactPage() {
	let form

	try {
		form = await getForm(config.site.slug, config.forms.contact)
	} catch (error) {
		console.error('Failed to fetch form:', error)
	}

	return (
		<div className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
			<div className='mb-8 sm:mb-12 text-center'>
				<h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4'>
					Entre em Contato
				</h1>
				<p className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto'>
					Tem alguma dúvida ou sugestão? Preencha o formulário abaixo e entraremos em contato em breve.
				</p>
			</div>

			{!form ? (
				<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center'>
					<p className='text-yellow-800'>
						Formulário de contato não disponível no momento. Por favor, tente novamente mais tarde.
					</p>
				</div>
			) : (
				<FormBuilder form={form} siteSlug={config.site.slug} />
			)}
		</div>
	)
}
