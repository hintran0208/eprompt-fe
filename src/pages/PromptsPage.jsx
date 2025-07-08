import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import usePromptStore from "../store/promptStore";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const PromptsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("updatedAt");

  const {
    prompts,
    categories,
    searchPrompts,
    getPromptsByCategory,
    getFavoritePrompts,
    toggleFavorite,
    deletePrompt,
  } = usePromptStore();

  // Handle URL parameters
  useEffect(() => {
    const filter = searchParams.get("filter");
    const category = searchParams.get("category");

    if (filter === "favorites") {
      setSelectedCategory("Favorites");
    } else if (filter === "recent") {
      setSelectedCategory("Recent");
    } else if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("All");
    }
  }, [searchParams]);

  // Get filtered prompts
  const getFilteredPrompts = () => {
    let filteredPrompts = [];

    if (searchQuery) {
      filteredPrompts = searchPrompts(searchQuery);
    } else if (selectedCategory === "All") {
      filteredPrompts = prompts;
    } else if (selectedCategory === "Favorites") {
      filteredPrompts = getFavoritePrompts();
    } else if (selectedCategory === "Recent") {
      filteredPrompts = [...prompts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else {
      filteredPrompts = getPromptsByCategory(selectedCategory);
    }

    // Sort prompts
    return [...filteredPrompts].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });
  };

  const filteredPrompts = getFilteredPrompts();

  const handleToggleFavorite = (promptId) => {
    toggleFavorite(promptId);
  };

  const handleDeletePrompt = (promptId) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      deletePrompt(promptId);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prompts</h1>
          <p className="text-gray-600 mt-1">
            {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link to="/prompts/new">
          <Button>+ New Prompt</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Card>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                <option value="Favorites">Favorites</option>
                <option value="Recent">Recent</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="updatedAt">Last Updated</option>
                <option value="createdAt">Date Created</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{prompt.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {prompt.category}
                      </span>
                      {prompt.isFavorite && <span className="text-yellow-500">⭐</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleToggleFavorite(prompt.id)}
                      className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      {prompt.isFavorite ? "⭐" : "☆"}
                    </button>
                    <button
                      onClick={() => handleDeletePrompt(prompt.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <p className="text-sm text-gray-600 line-clamp-3">{prompt.content}</p>
                </div>

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Updated {prompt.updatedAt.toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(prompt.content)}
                    >
                      📋 Copy
                    </Button>
                    <Link to={`/prompts/${prompt.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No prompts found" : "No prompts yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Get started by creating your first prompt"}
            </p>
            {!searchQuery && (
              <Link to="/prompts/new">
                <Button>Create Your First Prompt</Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PromptsPage;
