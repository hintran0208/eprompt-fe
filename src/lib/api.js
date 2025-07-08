import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post("/auth/refresh"),
  getCurrentUser: () => api.get("/auth/me"),
};

export const promptsAPI = {
  getAll: (params = {}) => api.get("/prompts", { params }),
  getById: (id) => api.get(`/prompts/${id}`),
  create: (promptData) => api.post("/prompts", promptData),
  update: (id, promptData) => api.put(`/prompts/${id}`, promptData),
  delete: (id) => api.delete(`/prompts/${id}`),
  search: (query) => api.get(`/prompts/search`, { params: { q: query } }),
  getByCategory: (category) => api.get(`/prompts/category/${category}`),
  getFavorites: () => api.get("/prompts/favorites"),
  toggleFavorite: (id) => api.post(`/prompts/${id}/favorite`),
};

export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  create: (categoryData) => api.post("/categories", categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (profileData) => api.put("/user/profile", profileData),
  updatePreferences: (preferences) => api.put("/user/preferences", preferences),
  exportData: () => api.get("/user/export"),
  importData: (data) => api.post("/user/import", data),
  deleteAccount: () => api.delete("/user/account"),
};

export default api;
