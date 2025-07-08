import { create } from "zustand";

const usePromptStore = create((set, get) => ({
  prompts: [
    {
      id: 1,
      title: "Code Review Assistant",
      content: "Please review the following code and provide suggestions for improvement...",
      category: "Development",
      tags: ["code", "review", "programming"],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      isFavorite: true,
    },
    {
      id: 2,
      title: "Email Writer",
      content: "Help me write a professional email for...",
      category: "Communication",
      tags: ["email", "professional", "communication"],
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-12"),
      isFavorite: false,
    },
    {
      id: 3,
      title: "Meeting Summary Generator",
      content: "Create a summary of the following meeting notes...",
      category: "Productivity",
      tags: ["meeting", "summary", "notes"],
      createdAt: new Date("2024-01-08"),
      updatedAt: new Date("2024-01-08"),
      isFavorite: true,
    },
  ],
  categories: ["Development", "Communication", "Productivity", "Creative", "Analysis"],

  // Actions
  addPrompt: (prompt) =>
    set((state) => ({
      prompts: [
        ...state.prompts,
        { ...prompt, id: Date.now(), createdAt: new Date(), updatedAt: new Date() },
      ],
    })),

  updatePrompt: (id, updates) =>
    set((state) => ({
      prompts: state.prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, ...updates, updatedAt: new Date() } : prompt
      ),
    })),

  deletePrompt: (id) =>
    set((state) => ({
      prompts: state.prompts.filter((prompt) => prompt.id !== id),
    })),

  toggleFavorite: (id) =>
    set((state) => ({
      prompts: state.prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, isFavorite: !prompt.isFavorite } : prompt
      ),
    })),

  getPromptsByCategory: (category) => {
    const state = get();
    return state.prompts.filter((prompt) => prompt.category === category);
  },

  getFavoritePrompts: () => {
    const state = get();
    return state.prompts.filter((prompt) => prompt.isFavorite);
  },

  searchPrompts: (query) => {
    const state = get();
    const lowercaseQuery = query.toLowerCase();
    return state.prompts.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(lowercaseQuery) ||
        prompt.content.toLowerCase().includes(lowercaseQuery) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  },
}));

export default usePromptStore;
