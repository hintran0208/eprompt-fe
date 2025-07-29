import { usePlaygroundStore } from '../store/playgroundStore'
import { Button, Card } from './ui'
import PropTypes from 'prop-types'
import { getVaultItemsByUserId, deleteVaultItem } from '../lib/api'
import { useEffect, useState } from 'react'
import useToast from '../hooks/useToast'

const SkeletonCard = () => {
	return (
		<Card className='p-4 animate-pulse'>
			<div className='flex items-start justify-between'>
				<div className='flex-1 min-w-0'>
					<div className='h-5 bg-gray-200 rounded w-1/3 mb-2'></div>
					<div className='h-4 bg-gray-200 rounded w-2/3 mb-3'></div>
					<div className='h-3 bg-gray-200 rounded w-1/4'></div>
				</div>
				<div className='flex items-center gap-2 ml-4'>
					<div className='h-8 w-20 bg-gray-200 rounded'></div>
					<div className='h-8 w-8 bg-gray-200 rounded-full'></div>
				</div>
			</div>
		</Card>
	)
}

const PromptVault = ({ setCurrentView }) => {
	const {
		vaults,
		setVaults,
		loadVaultItem,
		currentVaultItem,
	} = usePlaygroundStore()
	const [loading, setLoading] = useState(vaults.length === 0)

	const toast = useToast()

	const fetchVaults = async () => {
		setLoading(true)
		try {
			const userId = 'admin' // will replace with actual user ID logic
			const fetchedVaults = await getVaultItemsByUserId(userId)
			if (fetchedVaults) {
				setVaults(fetchedVaults)
			}
			toast.success(
				'Successfully got all vault items from database',
				1000
			)
		} catch (error) {
			toast.error('Failed to fetch vaults:', error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (vaults.length === 0) fetchVaults()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return (
			date.toLocaleDateString() +
			' ' +
			date.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			})
		)
	}

	const handleloadVaultItem = async (vault) => {
		const result = loadVaultItem(vault)
		if (result && typeof result.then === 'function') {
			await result
		}
		if (setCurrentView) setCurrentView('playground')
	}

	const handleDeleteVaultItem = async (vaultId, event) => {
		event.stopPropagation()
		if (confirm('Are you sure you want to delete this session?')) {
			await deleteVaultItem(vaultId)
			await fetchVaults()
		}
	}

	const getVaultStatus = (vault) => {
		if (vault.generatedContent) return { label: 'Complete', color: 'green' }
		if (vault.refinedPrompt) return { label: 'Refined', color: 'blue' }
		if (vault.initialPrompt) return { label: 'Generated', color: 'yellow' }
		return { label: 'Draft', color: 'gray' }
	}

	if (vaults.length === 0 && !loading) {
		return (
			<div className='space-y-6'>
				<div>
					<h2 className='text-2xl font-bold text-gray-900 mb-2'>
						Prompt Vault
					</h2>
					<p className='text-gray-600'>
						Your vaults will appear here
					</p>
				</div>

				<Card className='p-8 text-center'>
					<div className='text-gray-400 mb-4'>
						<svg
							className='mx-auto h-16 w-16'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1}
								d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
							/>
						</svg>
					</div>
					<h3 className='text-lg font-medium text-gray-900 mb-2'>
						No Vaults Yet
					</h3>
					<p className='text-gray-500'>
						Generate your first prompt in the playground to see it
						here.
					</p>
				</Card>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-bold text-gray-900 mb-2'>
						Prompt Vault
					</h2>
					<p className='text-gray-600'>
						Browse and reload your previous prompt vaults
					</p>
				</div>

				<Button
					onClick={fetchVaults}
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

			<div className='space-y-4'>
				{loading
					? Array.from({ length: 20 }).map((_, idx) => (
							<SkeletonCard key={idx} />
					  ))
					: vaults.map((vault) => {
							const status = getVaultStatus(vault)

							const isCurrentVault =
								currentVaultItem?.vaultId === vault.vaultId

							return (
								<Card
									key={vault.vaultId}
									className={`p-4 transition-all hover:shadow-md ${
										isCurrentVault
											? 'ring-2 ring-blue-500 bg-blue-50'
											: ''
									}`}
								>
									<div className='flex items-start justify-between'>
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-3 mb-2'>
												<h3 className='text-lg font-semibold text-gray-900 truncate'>
													{vault.name}
												</h3>
												<span
													className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
							status.color === 'green'
								? 'bg-green-100 text-green-800'
								: status.color === 'blue'
								? 'bg-blue-100 text-blue-800'
								: status.color === 'yellow'
								? 'bg-yellow-100 text-yellow-800'
								: 'bg-gray-100 text-gray-800'
						}
                    `}
												>
													{status.label}
												</span>
												{isCurrentVault && (
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
														Current
													</span>
												)}
											</div>
											{vault.description && (
												<div className='mb-3'>
													<p className='text-xs font-medium text-gray-700 mb-1'>
														Description:
													</p>
													<p className='text-sm text-gray-600 line-clamp-2'>
														{vault.description.substring(
															0,
															150
														)}
														{vault.description
															.length > 150
															? '...'
															: ''}
													</p>
												</div>
											)}
											{vault.initialPrompt && (
												<div className='mb-3'>
													<p className='text-xs font-medium text-gray-700 mb-1'>
														Generated Prompt:
													</p>
													<p className='text-sm text-gray-600 line-clamp-2'>
														{vault.initialPrompt.substring(
															0,
															150
														)}
														{vault.initialPrompt
															.length > 150
															? '...'
															: ''}
													</p>
												</div>
											)}

											<div className='text-xs text-gray-500'>
												Updated:{' '}
												{formatDate(vault.updatedAt)}
											</div>
										</div>

										<div className='flex items-center gap-2 ml-4'>
											<Button
												variant='outline'
												size='sm'
												onClick={async (e) => {
													e.stopPropagation()
													await handleloadVaultItem(
														vault
													)
												}}
											>
												Load
											</Button>
											<Button
												variant='ghost'
												size='sm'
												onClick={(e) =>
													handleDeleteVaultItem(
														vault.vaultId,
														e
													)
												}
												className='text-red-600 hover:text-red-700 hover:bg-red-50'
											>
												<svg
													className='w-4 h-4'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
													/>
												</svg>
											</Button>
										</div>
									</div>
								</Card>
							)
					  })}
			</div>

			{vaults.length > 0 && (
				<div className='text-center text-sm text-gray-500'>
					{vaults.length} vault{vaults.length === 1 ? '' : 's'} saved
				</div>
			)}
		</div>
	)
}

PromptVault.propTypes = {
	setCurrentView: PropTypes.func,
}

export default PromptVault
