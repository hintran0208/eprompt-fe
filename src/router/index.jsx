import { createBrowserRouter, Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import HomePage from "../pages/HomePage";
import PromptsPage from "../pages/PromptsPage";
import SettingsPage from "../pages/SettingsPage";

// Layout component
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Simple layout without sidebar (for home page)
const SimpleLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <SimpleLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/prompts",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PromptsPage />,
      },
    ],
  },
  {
    path: "/settings",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;
