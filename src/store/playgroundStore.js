import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePlaygroundStore = create()(
	persist(
		(set, get) => ({
			// App state
			currentTemplate: null,
			currentInput: {},
			generatedPrompt: null,
			refinedPrompt: null,
			generatedContent: null,
			activeTab: 'form',
			isLoading: false,
			currentVaultItem: null,

			// Data
			vaults: [],
			templates: [],

			// Actions
			setCurrentTemplate: (template) =>
				set({
					currentTemplate: template,
					currentInput: {},
					generatedPrompt: null,
					refinedPrompt: null,
					generatedContent: null,
					activeTab: 'form',
				}),

			setCurrentVaultItem: (currentVaultItem) =>
				set((state) => ({
					currentVaultItem: {
						...state.currentVaultItem,
						...currentVaultItem,
					},
				})),

			setCurrentInput: (input) => set({ currentInput: input }),

			setGeneratedPrompt: (prompt) =>
				set({
					generatedPrompt: prompt,
					activeTab: prompt ? 'prompt' : 'form',
				}),

			setRefinedPrompt: (prompt) =>
				set({
					refinedPrompt: prompt,
					activeTab: prompt ? 'refined' : 'prompt',
				}),

			setGeneratedContent: (content) =>
				set({
					generatedContent: content,
					activeTab: content ? 'content' : 'refined',
				}),

			setActiveTab: (tab) => set({ activeTab: tab }),

			setIsLoading: (loading) => set({ isLoading: loading }),

			loadVaultItem: (vault) => {
				const state = get();

				if (!vault) return

				set({
					currentTemplate: state.templates.find(
						(t) => t.id === vault.templateId
					),
					currentInput: '',
					generatedPrompt: vault.initialPrompt,
					refinedPrompt: vault.refinedPrompt || null,
					generatedContent: vault.generatedContent || null,
					activeTab: vault.generatedContent
						? 'content'
						: vault.refinedPrompt
						? 'refined'
						: vault.initialPrompt
						? 'prompt'
						: 'form',
					currentVaultItem: vault,
				})
			},

			clearCurrentSession: () =>
				set({
					currentTemplate: null,
					currentInput: {},
					generatedPrompt: null,
					refinedPrompt: null,
					generatedContent: null,
					activeTab: 'form',
					currentVaultItem: null,
				}),

			setTemplates: (templates) => set({ templates }),

			setVaults: (vaults) => set({ vaults }),
		}),
		{
			name: 'playground-storage',
			partialize: (state) => ({ sessions: state.sessions }), // Only persist sessions
		}
	)
)
