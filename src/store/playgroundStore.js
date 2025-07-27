import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlaygroundStore = create()(
  persist(
    (set, get) => ({
      // Initial state
      currentTemplate: null,
      currentInput: {},
      generatedPrompt: null,
      refinedPrompt: null,
      generatedContent: null,
      activeTab: 'form',
      isLoading: false,
      sessions: [],
      vaultId: null,

      // Actions
      setCurrentTemplate: (template) => set({ 
        currentTemplate: template,
        currentInput: {},
        generatedPrompt: null,
        refinedPrompt: null,
        generatedContent: null,
        activeTab: 'form'
      }),

      setVaultId: (vaultId) => set({ vaultId }),

      setCurrentInput: (input) => set({ currentInput: input }),

      setGeneratedPrompt: (prompt) => set({ 
        generatedPrompt: prompt,
        activeTab: prompt ? 'prompt' : 'form'
      }),

      setRefinedPrompt: (prompt) => set({ 
        refinedPrompt: prompt,
        activeTab: prompt ? 'refined' : 'prompt'
      }),

      setGeneratedContent: (content) => set({ 
        generatedContent: content,
        activeTab: content ? 'content' : 'refined'
      }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      saveCurrentSession: () => {
        const state = get();
        if (!state.currentTemplate || !state.generatedPrompt) return;

        const session = {
          id: Date.now().toString(),
          templateId: state.currentTemplate.id,
          templateName: state.currentTemplate.name,
          input: state.currentInput,
          generatedPrompt: state.generatedPrompt,
          refinedPrompt: state.refinedPrompt || undefined,
          generatedContent: state.generatedContent || undefined,
          createdAt: new Date().toISOString(),
          vaultId: state.vaultId || null, // Optional vaultId if needed
        };

        set(state => ({
          sessions: [session, ...state.sessions.slice(0, 49)] // Keep last 50 sessions
        }));
      },

      loadSession: (sessionId) => {
        const state = get();
        const session = state.sessions.find(s => s.id === sessionId);
        if (!session) return;        // We need to reconstruct the template from stored data
        // For now, we'll create a minimal template object
        const template = {
          id: session.templateId,
          name: session.templateName,
          description: `Loaded session: ${session.templateName}`,
          template: '',
          role: 'Assistant',
          tags: ['Session', 'Loaded'],
          requiredFields: Object.keys(session.input),
        };

        set({
          currentTemplate: template,
          currentInput: session.input,
          generatedPrompt: session.generatedPrompt,
          refinedPrompt: session.refinedPrompt || null,
          generatedContent: session.generatedContent || null,
          activeTab: session.generatedContent ? 'content' : 
                    session.refinedPrompt ? 'refined' : 
                    session.generatedPrompt ? 'prompt' : 'form'
        });
      },

      clearCurrentSession: () => set({
        currentTemplate: null,
        currentInput: {},
        generatedPrompt: null,
        refinedPrompt: null,
        generatedContent: null,
        activeTab: 'form'
      }),

      deleteSession: (sessionId) => set(state => ({
        sessions: state.sessions.filter(s => s.id !== sessionId)
      })),
    }),
    {
      name: 'playground-storage',
      partialize: (state) => ({ sessions: state.sessions }), // Only persist sessions
    }
  )
);
