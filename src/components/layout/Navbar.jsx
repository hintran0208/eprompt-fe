import { Link, useLocation } from "react-router-dom";

import { Button } from "../ui";
import useUserStore from "../../store/userStore";

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout, theme, toggleTheme } = useUserStore();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/prompts", label: "Prompts" },
    { path: "/settings", label: "Settings" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Prompt</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
              {theme === "light" ? "🌙" : "☀️"}
            </Button>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Welcome, {user?.name || "User"}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
