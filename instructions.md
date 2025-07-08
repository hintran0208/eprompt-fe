# Instructions for setting up `eprompt-fe`

This document provides instructions for GitHub Copilot to set up the project structure for the `eprompt-fe` frontend application. The application is built with React, Vite, and TypeScript, and is designed to be cross-platform using Tauri for desktop and Capacitor for mobile.

## 1. Project Initialization

1. **Create a new React project using Vite and TypeScript.**

   - Use the command: `npm create vite@latest . -- --template react-ts`
   - Then run `npm install` to install the dependencies.

2. **Install and configure TailwindCSS.**

   - Run `npm install -D tailwindcss postcss autoprefixer`.
   - Run `npx tailwindcss init -p` to create `tailwind.config.js` and `postcss.config.js`.
   - Configure `tailwind.config.js` to include paths to all template files:

     ```javascript
     /** @type {import('tailwindcss').Config} */
     export default {
       content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
       theme: {
         extend: {},
       },
       plugins: [],
     };
     ```

   - Create a `./src/index.css` file and add the Tailwind directives:

     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

   - Import `./index.css` at the top of `src/main.tsx`.

## 2. Core Application Structure

1. **Create the directory structure.**

   - Create the following directories inside the `src` folder:
     - `assets`
     - `components/ui` (for reusable UI components like buttons, inputs, etc.)
     - `components/layout` (for layout components like Navbar, Sidebar, etc.)
     - `hooks`
     - `lib/api` (for API client)
     - `lib/utils` (for utility functions)
     - `pages`
     - `router`
     - `store` (for Zustand state management)
     - `styles`

2. **Install core dependencies.**

   - `npm install react-router-dom zustand axios`

3. **Set up routing.**

   - Create a `src/router/index.tsx` file to define the application routes using `react-router-dom`.
   - Create placeholder pages in `src/pages` for `HomePage.tsx`, `PromptsPage.tsx`, `SettingsPage.tsx`.
   - Update `App.tsx` to use the router.

4. **Set up state management.**

   - Create a `src/store/promptStore.ts` file using Zustand to manage the state of the prompts.
   - Create a `src/store/userStore.ts` file for user authentication state.

5. **Create basic UI components.**
   - In `src/components/ui`, create basic components like `Button.tsx`, `Input.tsx`, and `Card.tsx`.
   - In `src/components/layout`, create `Navbar.tsx` and `Sidebar.tsx`.

## 3. Cross-Platform Setup

### Tauri (Desktop)

1. **Add Tauri to the project.**
   - Follow the Tauri "prerequisites" guide for your OS.
   - Run `npm install -D @tauri-apps/cli`.
   - Run `npx tauri init` and follow the prompts.
     - App name: `eprompt`
     - Window title: `E-Prompt`
     - Web assets path: `dist` (or your Vite build output directory)
     - Dev server URL: `http://localhost:5173` (or your Vite dev server)

### Capacitor (Mobile)

1. **Add Capacitor to the project.**
   - Run `npm install @capacitor/core @capacitor/cli`.
   - Run `npx cap init eprompt com.eprompt.app --web-dir="dist"`.
   - Install platforms:
     - `npm install @capacitor/android`
     - `npm install @capacitor/ios`

## 4. Final Steps

1. **Update `.gitignore`.**

   - Ensure that build artifacts, `node_modules`, and platform-specific files (`/src-tauri/target`, `/android`, `/ios`) are ignored.

2. **Create example files.**
   - Populate the created directories with example files to demonstrate the structure. For example, create a simple prompt list in `PromptsPage.tsx` that uses the `promptStore`.

By following these instructions, Copilot should be able to generate a clean, well-structured, and scalable frontend project for the E-Prompt application.
