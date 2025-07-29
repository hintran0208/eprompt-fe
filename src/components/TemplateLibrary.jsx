import { useEffect, useState, useRef } from 'react'
import { usePlaygroundStore } from '../store/playgroundStore'
import { Button, Card } from './ui'
import { getAllTemplates } from '../lib/api'
import { useToast } from '../hooks'

// Simple skeleton card component
const SkeletonCard = () => (
	<div className='animate-pulse'>
		<Card className='p-6'>
			<div className='space-y-4'>
				<div>
					<div className='h-5 bg-gray-200 rounded w-2/3 mb-2' />
					<div className='h-4 bg-gray-200 rounded w-full mb-3' />
				</div>
				<div className='space-y-2'>
					<div className='flex gap-1'>
						<div className='h-4 w-12 bg-gray-200 rounded' />
						<div className='h-4 w-8 bg-gray-200 rounded' />
					</div>
					<div className='h-3 bg-gray-200 rounded w-1/2' />
					<div className='h-3 bg-gray-200 rounded w-2/3' />
					<div className='h-3 bg-gray-200 rounded w-1/3' />
				</div>
				<div className='h-9 bg-gray-200 rounded w-full mt-2' />
			</div>
		</Card>
	</div>
)

const TemplateLibrary = () => {
	const {
		templates,
		setTemplates,
		setCurrentTemplate,
		currentTemplate,
	} = usePlaygroundStore()
	const selectedCardRef = useRef(null)
	const [loading, setLoading] = useState(templates.length === 0)
	const toast = useToast()

	const fetchTemplates = async () => {
		setLoading(true)
		try {
			const data = await getAllTemplates()
			setTemplates(data)
			toast.success('Successfully got all templates from database', 1000)
		} catch (err) {
			toast.error(`Failed to load templates: ${err.message}`)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (templates.length === 0) fetchTemplates()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSelectTemplate = (template) => {
		setCurrentTemplate(template)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-900 mb-2'>
						Template Library
					</h2>
					<p className='text-gray-600'>
						Choose a template to get started with prompt generation
					</p>
				</div>

				<Button
					onClick={fetchTemplates}
					variant='outline'
					className='flex items-center'
				>
					<svg
						className='w-4 h-4 mr-2'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 4v5h.582M20 20v-5h-.581M5 9a7 7 0 0110 0M19 15a7 7 0 01-10 0'
						/>
					</svg>
					Refresh
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{loading
					? Array.from({ length: 12 }).map((_, idx) => (
							<SkeletonCard key={idx} />
					  ))
					: templates.map((template) => {
							const isSelected =
								currentTemplate?.id === template.id
							return (
								<Card
									key={template.id}
									className='p-6 hover:shadow-lg transition-shadow'
									ref={isSelected ? selectedCardRef : null}
								>
									<div className='space-y-4'>
										<div>
											<h3 className='text-lg font-semibold text-gray-900 mb-2'>
												{template.name}
											</h3>
											<p className='text-gray-600 text-sm mb-3'>
												{template.description}
											</p>
										</div>
										<div className='space-y-2'>
											<div className='flex items-center gap-1 flex-wrap'>
												{template.tags.map(
													(tag, index) => (
														<span
															key={index}
															className='text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded'
														>
															{tag}
														</span>
													)
												)}
											</div>
											<div className='text-xs text-gray-500'>
												<span className='font-medium'>
													Role:
												</span>{' '}
												{template.role}
											</div>
											<div className='text-xs text-gray-500'>
												<span className='font-medium'>
													Required fields:
												</span>{' '}
												{template.requiredFields.join(
													', '
												)}
											</div>
											{template.optionalFields &&
												template.optionalFields.length >
													0 && (
													<div className='text-xs text-gray-500'>
														<span className='font-medium'>
															Optional fields:
														</span>{' '}
														{template.optionalFields.join(
															', '
														)}
													</div>
												)}
										</div>
										<Button
											onClick={() =>
												handleSelectTemplate(template)
											}
											variant={
												isSelected
													? 'primary'
													: 'outline'
											}
											className='w-full'
										>
											{isSelected ? (
												<span className='flex items-center'>
													<svg
														className='w-4 h-4 mr-2'
														fill='currentColor'
														viewBox='0 0 20 20'
													>
														<path
															fillRule='evenodd'
															d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
															clipRule='evenodd'
														/>
													</svg>
													Selected
												</span>
											) : (
												'Select Template'
											)}
										</Button>
									</div>
								</Card>
							)
					  })}
			</div>
		</div>
	)
}

export default TemplateLibrary
