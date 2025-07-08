# E-Prompt Frontend

A modern, cross-platform prompt management application built with React, Vite, and TypeScript. E-Prompt helps you organize, store, and access your AI prompts across desktop and mobile devices.

## Features

- 🚀 **Cross-Platform**: Desktop (Tauri) and Mobile (Capacitor) support
- 📂 **Smart Organization**: Categories, tags, and powerful search
- ⭐ **Favorites**: Mark and quickly access your most-used prompts
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔍 **Search**: Fast search across all prompts
- 💾 **Local Storage**: Your data stays on your device
- 🌙 **Dark Mode**: Built-in theme switching
- 📱 **Responsive**: Works great on all screen sizes

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Desktop**: Tauri
- **Mobile**: Capacitor

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── ui/         # Base UI components (Button, Input, Card)
│   └── layout/     # Layout components (Navbar, Sidebar)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and API client
│   ├── api.js      # API client configuration
│   └── utils.js    # Utility functions
├── pages/          # Page components
├── router/         # React Router configuration
├── store/          # Zustand stores
│   ├── promptStore.js  # Prompt state management
│   └── userStore.js    # User and preferences state
└── styles/         # Additional stylesheets
```

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd eprompt-fe
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Cross-Platform Development

### Desktop (Tauri)

1. Install Tauri CLI:

```bash
npm install -D @tauri-apps/cli
```

2. Initialize Tauri:

```bash
npx tauri init
```

3. Run in development:

```bash
npx tauri dev
```

4. Build desktop app:

```bash
npx tauri build
```

### Mobile (Capacitor)

1. Install Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
```

2. Initialize Capacitor:

```bash
npx cap init eprompt com.eprompt.app --web-dir="dist"
```

3. Add platforms:

```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

4. Build and sync:

```bash
npm run build
npx cap sync
```

5. Open in platform IDE:

```bash
npx cap open android
npx cap open ios
```

## State Management

The application uses Zustand for state management with two main stores:

### Prompt Store (`src/store/promptStore.js`)

- Manages all prompt data
- Handles CRUD operations
- Provides search and filtering functions
- Manages categories and favorites

### User Store (`src/store/userStore.js`)

- Manages user authentication state
- Handles application preferences
- Manages theme settings
- Persists data to localStorage

## Component Library

### UI Components (`src/components/ui/`)

- **Button**: Flexible button component with variants
- **Input**: Form input with validation support
- **Card**: Container component for content sections

### Layout Components (`src/components/layout/`)

- **Navbar**: Top navigation with user menu
- **Sidebar**: Collapsible sidebar with navigation

## API Integration

The application is ready for backend integration with:

- Authentication endpoints
- CRUD operations for prompts
- User profile management
- Data import/export

API client is configured in `src/lib/api.js` with interceptors for:

- Automatic token attachment
- Error handling
- Response transformation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
