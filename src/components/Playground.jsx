import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { usePlaygroundStore } from '../store/playgroundStore'
import {
	generatePrompt,
	refinePrompt,
	generateAIContent,
	refineContent,
	updateVaultItem,
} from '../lib/api'
import { copyToClipboard } from '../lib/utils'
import { exportAllContent } from '../lib/exportUtils'
import { Button, Card, Textarea, ExportModal, Modal } from './ui'
import { useToast } from '../hooks'
import RefineToolbar from './RefineToolbar'

const Playground = () => {
	const {
		currentTemplate,
		currentInput,
		generatedPrompt,
		refinedPrompt,
		generatedContent,
		activeTab,
		isLoading,
		currentVaultItem,
		setCurrentInput,
		setGeneratedPrompt,
		setRefinedPrompt,
		setGeneratedContent,
		setCurrentVaultItem,
		setActiveTab,
		setIsLoading,
	} = usePlaygroundStore()

	const [formErrors, setFormErrors] = useState({})
	const [editablePrompt, setEditablePrompt] = useState('')
	const [editableRefinedPrompt, setEditableRefinedPrompt] = useState('')
	const [editableContent, setEditableContent] = useState('')
	const [isEditingPrompt, setIsEditingPrompt] = useState(false)
	const [isEditingRefinedPrompt, setIsEditingRefinedPrompt] = useState(false)
	const [isEditingContent, setIsEditingContent] = useState(false)
	const [isEditingName, setIsEditingName] = useState(false)
	const [isEditingDescription, setIsEditingDescription] = useState(false)
	const [showMarkdownPreview, setShowMarkdownPreview] = useState(false)
	const [showExportModal, setShowExportModal] = useState(false)
	const [showNameModal, setShowNameModal] = useState(false)
	const [vaultName, setVaultName] = useState('')
	const [vaultDescription, setVaultDescription] = useState('')

	const toast = useToast()

	// Sync editable states with store values
	useEffect(() => {
		if (generatedPrompt && !isEditingPrompt) {
			setEditablePrompt(generatedPrompt)
		}
	}, [generatedPrompt, isEditingPrompt])

	useEffect(() => {
		if (refinedPrompt && !isEditingRefinedPrompt) {
			setEditableRefinedPrompt(refinedPrompt)
		}
	}, [refinedPrompt, isEditingRefinedPrompt])

	useEffect(() => {
		if (generatedContent && !isEditingContent) {
			setEditableContent(generatedContent)
		}
	}, [generatedContent, isEditingContent])

	const handleSaveName = () => {
		setIsEditingName(false)
		setCurrentVaultItem({ name: vaultName })
	}

	const handleSaveDescription = () => {
		setIsEditingDescription(false)
		setCurrentVaultItem({
			description: vaultDescription,
		})
	}

	const handleOpenNameModal = () => {
		setVaultName(currentVaultItem?.name || '')
		setVaultDescription(currentVaultItem?.description || '')
		setShowNameModal(true)
	}

	const handleSubmitNameModal = () => {
		if (!vaultName.trim() || !vaultDescription.trim()) {
			return alert('Name and description are required!')
		}

		setCurrentVaultItem({
			name: vaultName,
			description: vaultDescription,
		})
		setShowNameModal(false)

		toast.success('Vault item name and description updated successfully!')
	}

	const handleCloseNameModal = () => {
		setShowNameModal(false)
	}

	const handleSaveEdits = (type) => {
		switch (type) {
			case 'prompt':
				setGeneratedPrompt(editablePrompt)
				setIsEditingPrompt(false)
				break
			case 'refinedPrompt':
				setRefinedPrompt(editableRefinedPrompt)
				setIsEditingRefinedPrompt(false)
				break
			case 'content':
				setGeneratedContent(editableContent)
				setIsEditingContent(false)
				break
		}
		toast.success('Changes saved successfully!')
	}

	const handleDiscardEdits = (type) => {
		switch (type) {
			case 'prompt':
				setEditablePrompt(generatedPrompt)
				setIsEditingPrompt(false)
				break
			case 'refinedPrompt':
				setEditableRefinedPrompt(refinedPrompt)
				setIsEditingRefinedPrompt(false)
				break
			case 'content':
				setEditableContent(generatedContent)
				setIsEditingContent(false)
				break
		}
	}

	const renderEditableContent = (
		content,
		editableContentValue,
		isEditing,
		setIsEditing,
		onSave,
		onDiscard,
		type,
		bgColor = 'bg-gray-50'
	) => (
		<div>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-lg font-semibold text-gray-900'>
					{type === 'prompt'
						? 'Generated Prompt'
						: type === 'refinedPrompt'
						? 'Refined Prompt'
						: 'Generated Content'}
					{isEditing && (
						<span className='ml-2 text-sm text-blue-600 font-normal'>
							(Editing)
						</span>
					)}
				</h3>
				<div className='flex items-center space-x-2'>
					{!isEditing && (
						<Button
							variant='outline'
							size='sm'
							onClick={() =>
								setShowMarkdownPreview(!showMarkdownPreview)
							}
							className='flex items-center'
						>
							<svg
								className='w-4 h-4 mr-1'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
								/>
							</svg>
							{showMarkdownPreview ? 'Raw' : 'Markdown'}
						</Button>
					)}
					<Button
						variant='outline'
						size='sm'
						onClick={() => setIsEditing(!isEditing)}
						className='flex items-center'
					>
						<svg
							className='w-4 h-4 mr-1'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							{isEditing ? (
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							) : (
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
								/>
							)}
						</svg>
						{isEditing ? 'Cancel' : 'Edit'}
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() =>
							handleCopy(
								content,
								type,
								isEditing,
								editableContentValue
							)
						}
						className='flex items-center'
					>
						<svg
							className='w-4 h-4 mr-1'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
							/>
						</svg>
						Copy
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => {
							const contentToExport = isEditing
								? editableContentValue
								: content
							handleIndividualExport(type, contentToExport)
						}}
						className='flex items-center'
					>
						<svg
							className='w-4 h-4 mr-1'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
							/>
						</svg>
						Export
					</Button>
				</div>
			</div>

			<Card className={`p-4 ${bgColor}`}>
				{isEditing ? (
					<div className='space-y-3'>
						<Textarea
							value={editableContentValue}
							onChange={(e) => {
								switch (type) {
									case 'prompt':
										setEditablePrompt(e.target.value)
										break
									case 'refinedPrompt':
										setEditableRefinedPrompt(e.target.value)
										break
									case 'content':
										setEditableContent(e.target.value)
										break
								}
							}}
							rows={type === 'content' ? 16 : 12}
							className='font-mono text-sm bg-white'
							placeholder={`Edit your ${
								type === 'refinedPrompt'
									? 'refined prompt'
									: type
							} here...`}
						/>
						<div className='flex justify-end space-x-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => onDiscard(type)}
							>
								Discard
							</Button>
							<Button
								variant='primary'
								size='sm'
								onClick={() => onSave(type)}
							>
								Save Changes
							</Button>
						</div>
					</div>
				) : showMarkdownPreview ? (
					<div className='prose prose-sm max-w-none text-gray-700 max-h-96 overflow-y-auto'>
						<ReactMarkdown>{content}</ReactMarkdown>
					</div>
				) : (
					<pre className='whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto'>
						{content}
					</pre>
				)}
			</Card>
		</div>
	)

	const handleInputChange = (field, value) => {
		setCurrentInput({ ...currentInput, [field]: value })
		if (formErrors[field]) {
			setFormErrors({ ...formErrors, [field]: '' })
		}
	}

	const handleCopy = async (
		text,
		type,
		isEditing = false,
		editableText = ''
	) => {
		const textToCopy = isEditing ? editableText : text
		const success = await copyToClipboard(textToCopy)
		if (success) {
			toast.success(`${type} copied to clipboard!`)
		} else {
			toast.error('Failed to copy to clipboard')
		}
	}

	const validateForm = () => {
		if (!currentTemplate) return false

		const errors = {}

		currentTemplate.requiredFields.forEach((field) => {
			if (!currentInput[field]?.trim()) {
				errors[field] = `${field} is required`
			}
		})

		setFormErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleGeneratePrompt = async () => {
		if (!currentTemplate || !validateForm()) return
		console.log(currentVaultItem)
		if (!currentVaultItem || !currentVaultItem.name) {
			handleOpenNameModal()
			return
		}

		setIsLoading(true)
		try {
			const { prompt, vaultItem } = await generatePrompt(
				currentTemplate,
				currentInput,
				currentVaultItem
			)
			setGeneratedPrompt(prompt)
			setCurrentVaultItem(vaultItem)
			toast.success('Prompt generated successfully!')
		} catch (error) {
			console.error('Failed to generate prompt:', error)
			toast.error('Failed to generate prompt. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleRefinePrompt = async (type) => {
		const promptToRefine = isEditingPrompt
			? editablePrompt
			: generatedPrompt
		if (!promptToRefine) return

		setIsLoading(true)
		try {
			const refined = await refinePrompt(
				type,
				promptToRefine,
				currentVaultItem?.vaultId
			)
			setRefinedPrompt(refined)
			setEditableRefinedPrompt(refined)
			toast.success('Prompt refined successfully!')
		} catch (error) {
			console.error('Failed to refine prompt:', error)
			toast.error('Failed to refine prompt. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleRefineRefinedPrompt = async (type) => {
		const promptToRefine = isEditingRefinedPrompt
			? editableRefinedPrompt
			: refinedPrompt
		if (!promptToRefine) return

		setIsLoading(true)
		try {
			const refined = await refinePrompt(type, promptToRefine)
			setRefinedPrompt(refined)
			setEditableRefinedPrompt(refined)
			toast.success('Prompt refined successfully!')
		} catch (error) {
			console.error('Failed to refine prompt:', error)
			toast.error('Failed to refine prompt. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleGenerateContent = async (useRefinedPrompt = false) => {
		let promptToUse
		if (useRefinedPrompt) {
			promptToUse = isEditingRefinedPrompt
				? editableRefinedPrompt
				: refinedPrompt
		} else {
			promptToUse = isEditingPrompt ? editablePrompt : generatedPrompt
		}

		if (!promptToUse) return

		setIsLoading(true)
		try {
			const content = await generateAIContent(
				promptToUse,
				useRefinedPrompt,
				currentVaultItem?.vaultId
			)
			setGeneratedContent(content)
			setEditableContent(content)
			toast.success(
				`Content generated successfully from ${
					useRefinedPrompt ? 'refined' : 'basic'
				} prompt!`
			)
		} catch (error) {
			console.error('Failed to generate content:', error)
			toast.error('Failed to generate content. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleRefineContent = async (type) => {
		const contentToRefine = isEditingContent
			? editableContent
			: generatedContent
		if (!contentToRefine) return

		setIsLoading(true)
		try {
			const refined = await refineContent(
				type,
				contentToRefine,
				currentVaultItem?.vaultId
			)
			setGeneratedContent(refined)
			setEditableContent(refined)
			toast.success('Content refined successfully!')
		} catch (error) {
			console.error('Failed to refine content:', error)
			toast.error('Failed to refine content. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSaveVaultItem = async () => {
		try {
			if (!currentVaultItem) {
				toast.error('No Vault Item to save!')
				return
			}

			setIsLoading(true)
			const updatedVaultItem = await updateVaultItem(currentVaultItem)
			setCurrentVaultItem(updatedVaultItem)
			toast.success('Vault Item saved successfully!')
		} catch (error) {
			console.error('Failed to save Vault Item:', error)
			toast.error('Failed to save Vault Item. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleExport = async (dataToExport, fileType, options = {}) => {
		try {
			await exportAllContent(dataToExport, fileType, options)
			const formatText = options.enableMarkdown
				? `formatted ${fileType.toUpperCase()}`
				: fileType.toUpperCase()
			toast.success(`Content exported successfully as ${formatText}!`)
		} catch (error) {
			console.error('Export failed:', error)
			toast.error('Failed to export content. Please try again.')
		}
	}

	const [preSelectedExportContent, setPreSelectedExportContent] = useState(
		null
	)

	const handleIndividualExport = (contentType, content) => {
		const exportData = {}

		// Map the content type to the correct key
		switch (contentType) {
			case 'prompt':
				exportData.basicPrompt = content
				break
			case 'refinedPrompt':
				exportData.refinedPrompt = content
				break
			case 'content':
				exportData.generatedContent = content
				break
			default:
				exportData[contentType] = content
		}

		// Pre-select this content in the modal
		setPreSelectedExportContent(exportData)
		setShowExportModal(true)
	}

	const getAvailableExportContent = () => {
		return {
			basicPrompt: isEditingPrompt ? editablePrompt : generatedPrompt,
			refinedPrompt: isEditingRefinedPrompt
				? editableRefinedPrompt
				: refinedPrompt,
			generatedContent: isEditingContent
				? editableContent
				: generatedContent,
		}
	}

	const renderForm = () => (
		<div className='space-y-6'>
			<div>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					Fill Template: {currentTemplate?.name}
				</h3>
				<p className='text-gray-600 mb-6'>
					{currentTemplate?.description}
				</p>
			</div>

			<div className='space-y-4'>
				{currentTemplate?.requiredFields.map((field) => (
					<div key={field}>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							{field} *
						</label>
						<Textarea
							value={currentInput[field] || ''}
							onChange={(e) =>
								handleInputChange(field, e.target.value)
							}
							rows={4}
							className='font-mono text-sm bg-white'
							placeholder={`Enter ${field}...`}
						/>
						{formErrors[field] && (
							<span className='text-xs text-red-500'>
								{formErrors[field]}
							</span>
						)}
					</div>
				))}

				{currentTemplate?.optionalFields?.map((field) => (
					<div key={field}>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							{field}
						</label>
						<Textarea
							value={currentInput[field] || ''}
							onChange={(e) =>
								handleInputChange(field, e.target.value)
							}
							rows={3}
							className='font-mono text-sm bg-white'
							placeholder={`Enter ${field} (optional)...`}
						/>
					</div>
				))}
			</div>

			<Button
				onClick={handleGeneratePrompt}
				disabled={isLoading}
				className='w-full'
			>
				{isLoading ? 'Generating...' : 'Generate Prompt'}
			</Button>
		</div>
	)

	const renderPrompt = () => (
		<div className='space-y-6'>
			{renderEditableContent(
				generatedPrompt,
				editablePrompt,
				isEditingPrompt,
				setIsEditingPrompt,
				handleSaveEdits,
				handleDiscardEdits,
				'prompt',
				'bg-gray-50'
			)}

			<RefineToolbar
				onRefine={handleRefinePrompt}
				isLoading={isLoading}
				mode='prompt'
			/>

			<div className='pt-4 border-t'>
				<Button
					onClick={() => handleGenerateContent(false)}
					disabled={isLoading}
					variant='primary'
					className='w-full'
				>
					{isLoading
						? 'Generating Content...'
						: 'Generate AI Content from Basic Prompt'}
				</Button>
			</div>
		</div>
	)

	const renderRefinedPrompt = () => (
		<div className='space-y-6'>
			{renderEditableContent(
				refinedPrompt,
				editableRefinedPrompt,
				isEditingRefinedPrompt,
				setIsEditingRefinedPrompt,
				handleSaveEdits,
				handleDiscardEdits,
				'refinedPrompt',
				'bg-green-50'
			)}

			<RefineToolbar
				onRefine={handleRefineRefinedPrompt}
				isLoading={isLoading}
				mode='prompt'
			/>

			<div className='pt-4 border-t'>
				<Button
					onClick={() => handleGenerateContent(true)}
					disabled={isLoading}
					variant='primary'
					className='w-full'
				>
					{isLoading
						? 'Generating Content...'
						: 'Generate AI Content from Refined Prompt'}
				</Button>
			</div>
		</div>
	)

	const renderContent = () => (
		<div className='space-y-6'>
			{renderEditableContent(
				generatedContent,
				editableContent,
				isEditingContent,
				setIsEditingContent,
				handleSaveEdits,
				handleDiscardEdits,
				'content',
				'bg-blue-50'
			)}

			<RefineToolbar
				onRefine={handleRefineContent}
				isLoading={isLoading}
				mode='content'
			/>
		</div>
	)

	const renderTabs = () => {
		const tabs = [
			{ id: 'form', label: 'Form', enabled: !generatedPrompt },
			{ id: 'initial-prompt', label: 'Prompt', enabled: !!generatedPrompt },
			{
				id: 'refined-prompt',
				label: 'Refined Prompt',
				enabled: !!refinedPrompt,
			},
			{
				id: 'content',
				label: 'Generated Content',
				enabled: !!generatedContent,
			},
		]

		return (
			<div className='border-b border-gray-200'>
				<nav className='-mb-px flex space-x-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => tab.enabled && setActiveTab(tab.id)}
							className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${
					tab.enabled
						? activeTab === tab.id
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						: 'border-transparent text-gray-300 cursor-not-allowed'
				}
              `}
							disabled={!tab.enabled}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</div>
		)
	}

	if (!currentTemplate) {
		return (
			<Card className='p-8 text-center'>
				<div className='max-w-2xl mx-auto'>
					<div className='mb-6'>
						<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<svg
								className='w-8 h-8 text-blue-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M13 10V3L4 14h7v7l9-11h-7z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-semibold text-gray-900 mb-2'>
							No Template Selected
						</h3>
						<p className='text-gray-600 mb-6'>
							Choose a template from the library to start
							generating and refining prompts
						</p>
					</div>

					<div className='bg-gray-50 rounded-lg p-6 text-left'>
						<h4 className='font-medium text-gray-900 mb-3'>
							How it works:
						</h4>
						<div className='space-y-2 text-sm text-gray-600'>
							<div className='flex items-start'>
								<span className='inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center'>
									1
								</span>
								<span>
									Select a template from the Template Library
								</span>
							</div>
							<div className='flex items-start'>
								<span className='inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center'>
									2
								</span>
								<span>
									Fill in the required fields for your
									template
								</span>
							</div>
							<div className='flex items-start'>
								<span className='inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center'>
									3
								</span>
								<span>Generate your initial prompt</span>
							</div>
							<div className='flex items-start'>
								<span className='inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center'>
									4
								</span>
								<span>
									Refine your prompt using AI-powered tools
								</span>
							</div>
							<div className='flex items-start'>
								<span className='inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center'>
									5
								</span>
								<span>
									Generate content from your refined prompt
								</span>
							</div>
						</div>
					</div>

					<div className='mt-6'>
						<p className='text-sm text-gray-500'>
							Go to the Templates section to choose a template and
							get started
						</p>
					</div>
				</div>
			</Card>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-900 mb-2'>
						Playground
					</h2>
					<p className='text-gray-600'>
						Generate and refine prompts using the selected template
					</p>
				</div>
				<div className='flex items-center justify-end space-x-2'>
					<Button
						disabled={!(currentVaultItem && generatedPrompt)}
						variant='outline'
						onClick={handleSaveVaultItem}
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
								d='M5 13l4 4L19 7'
							/>
						</svg>
						Save Vault Item
					</Button>

					<Button
						disabled={
							!(
								generatedPrompt ||
								refinedPrompt ||
								generatedContent
							)
						}
						variant='outline'
						onClick={() => setShowExportModal(true)}
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
								d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
							/>
						</svg>
						Export Content
					</Button>
				</div>
			</div>

			<Card className='p-6'>
				<div className='space-y-1'>
					{' '}
					{isEditingName ? (
						<Textarea
							value={vaultName}
							onChange={(e) => setVaultName(e.target.value)}
							onBlur={handleSaveName}
							rows={1}
							className='text-2xl font-bold text-gray-900 resize-none bg-transparent focus:outline-none h-[40px]'
							autoFocus
						/>
					) : (
						<h2
							className='text-2xl font-bold text-gray-900 cursor-pointer h-[40px] flex items-center'
							onClick={() => setIsEditingName(true)}
						>
							{currentVaultItem?.name || 'Untitled Vault'}
						</h2>
					)}
					{/* Description */}
					{isEditingDescription ? (
						<Textarea
							value={vaultDescription}
							onChange={(e) =>
								setVaultDescription(e.target.value)
							}
							onBlur={handleSaveDescription}
							rows={2}
							className='text-gray-600 resize-none bg-transparent focus:outline-none h-[60px]'
							autoFocus
						/>
					) : (
						<p
							className='text-gray-600 cursor-pointer h-[60px] flex items-top'
							onClick={() => setIsEditingDescription(true)}
						>
							{currentVaultItem?.description ||
								'No description provided.'}
						</p>
					)}
				</div>

				{renderTabs()}

				<div className='mt-6'>
					{activeTab === 'form' && renderForm()}
					{activeTab === 'initial-prompt' && renderPrompt()}
					{activeTab === 'refined-prompt' && renderRefinedPrompt()}
					{activeTab === 'content' && renderContent()}
				</div>
			</Card>

			{/* Export Modal */}
			<ExportModal
				isOpen={showExportModal}
				onClose={() => {
					setShowExportModal(false)
					setPreSelectedExportContent(null)
				}}
				onExport={handleExport}
				availableContent={getAvailableExportContent()}
				preSelectedContent={preSelectedExportContent}
			/>
			<Modal isOpen={showNameModal} onClose={handleCloseNameModal}>
				<div className='p-6 space-y-4'>
					<h3 className='text-lg font-semibold text-gray-900'>
						Enter Vault Details
					</h3>
					<p className='text-sm text-gray-600'>
						Please provide a Vault Name before continuing.
					</p>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Name*
						</label>
						<Textarea
							value={vaultName}
							onChange={(e) => setVaultName(e.target.value)}
							placeholder='Enter name'
							className='mt-1'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Description
						</label>
						<Textarea
							value={vaultDescription}
							onChange={(e) =>
								setVaultDescription(e.target.value)
							}
							placeholder='Enter description'
							className='mt-1'
						/>
					</div>
					<div className='flex justify-end space-x-2'>
						<Button
							variant='outline'
							onClick={handleCloseNameModal}
						>
							Cancel
						</Button>
						<Button
							variant='primary'
							onClick={handleSubmitNameModal}
						>
							Submit
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default Playground
