import React, { useState } from 'react';
import SemanticSearch from '../components/SemanticSearch';

const AppLayoutMinimal = () => {
  const [currentView, setCurrentView] = useState('templates');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-yellow-800 text-sm font-medium">
            🚧 Development Mode - Testing with SemanticSearch
          </span>
        </div>
      </div>
      
      <SemanticSearch />
      
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">E-Prompt</h1>
              <span className="ml-2 text-sm text-gray-500">Assistant</span>
            </div>

            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('templates')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'templates'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setCurrentView('playground')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'playground'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Playground
              </button>
              <button
                onClick={() => setCurrentView('vault')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'vault'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Vault
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current View: {currentView}</h2>
          <p className="text-gray-600">Minimal layout is working! Now we'll add components step by step.</p>
        </div>
      </main>
    </div>
  );
};

export default AppLayoutMinimal;
