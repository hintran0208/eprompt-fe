import { Link, useLocation } from "react-router-dom";
import useUserStore from "../../store/userStore";
import usePromptStore from "../../store/promptStore";

const Sidebar = () => {
  const location = useLocation();
  const { preferences, toggleSidebar } = useUserStore();
  const { categories, getFavoritePrompts } = usePromptStore();
  const favoriteCount = getFavoritePrompts().length;

  const sidebarItems = [
    {
      label: "All Prompts",
      path: "/prompts",
      icon: "📄",
      count: null,
    },
    {
      label: "Favorites",
      path: "/prompts?filter=favorites",
      icon: "⭐",
      count: favoriteCount,
    },
    {
      label: "Recent",
      path: "/prompts?filter=recent",
      icon: "🕒",
      count: null,
    },
  ];

  if (preferences.sidebarCollapsed) {
    return (
      <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
          >
            ☰
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Library</h2>
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <Link
          to="/prompts/new"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          + New Prompt
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path || location.search.includes(item.path.split("?")[1])
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.count !== null && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Categories
          </h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/prompts?category=${encodeURIComponent(category)}`}
                className="flex items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
