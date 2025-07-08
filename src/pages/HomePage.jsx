import { Link } from "react-router-dom";
import usePromptStore from "../store/promptStore";
import useUserStore from "../store/userStore";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const HomePage = () => {
  const { prompts, getFavoritePrompts } = usePromptStore();
  const { isAuthenticated, user } = useUserStore();

  const recentPrompts = prompts.slice(0, 3);
  const favoritePrompts = getFavoritePrompts().slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to E-Prompt</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your intelligent prompt management system. Store, organize, and access your AI prompts
          across all platforms - desktop and mobile.
        </p>
        {!isAuthenticated ? (
          <div className="flex justify-center space-x-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link to="/prompts">
              <Button size="lg">Go to Your Prompts</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Welcome message for authenticated users */}
      {isAuthenticated && (
        <div className="mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-900">
                  Welcome back, {user?.name || "User"}!
                </h2>
                <p className="text-blue-700">You have {prompts.length} prompts in your library.</p>
              </div>
              <Link to="/prompts/new">
                <Button>Create New Prompt</Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cross-Platform</h3>
            <p className="text-gray-600">
              Access your prompts anywhere - desktop, web, or mobile devices.
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📂</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Organization</h3>
            <p className="text-gray-600">
              Organize prompts with categories, tags, and powerful search functionality.
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Access</h3>
            <p className="text-gray-600">
              Find and use your prompts instantly with our intuitive interface.
            </p>
          </div>
        </Card>
      </div>

      {/* Recent and Favorite Prompts */}
      {isAuthenticated && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Prompts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Prompts</h2>
              <Link to="/prompts" className="text-blue-600 hover:text-blue-800 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentPrompts.map((prompt) => (
                <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{prompt.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {prompt.content.substring(0, 100)}...
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {prompt.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {prompt.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Favorite Prompts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Favorite Prompts</h2>
              <Link
                to="/prompts?filter=favorites"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {favoritePrompts.length > 0 ? (
                favoritePrompts.map((prompt) => (
                  <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{prompt.title}</h3>
                          <span className="text-yellow-500">⭐</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {prompt.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {prompt.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card>
                  <div className="text-center text-gray-500">
                    <p>No favorite prompts yet.</p>
                    <Link to="/prompts" className="text-blue-600 hover:text-blue-800 text-sm">
                      Mark some prompts as favorites
                    </Link>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
