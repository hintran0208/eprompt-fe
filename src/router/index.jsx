import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SimpleLayout from "../components/layout/SimpleLayout";
import HomePage from "../pages/HomePage";
import PromptsPage from "../pages/PromptsPage";
import SettingsPage from "../pages/SettingsPage";
import AppLayout from "../pages/AppLayout";
import Spotlight from "../pages/Spotlight";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
  },
  {
    path: "/home",
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
  {
    path: "/spotlight",
    element: <Spotlight />,
  },
]);

export default router;
