import { useState, useEffect, useCallback } from 'react';
import SemanticSearch from '../components/SemanticSearch';
import TemplateLibrary from '../components/TemplateLibrary';
import Playground from '../components/Playground';
import PromptVault from '../components/PromptVault';
import { usePlaygroundStore } from '../store/playgroundStore';
import { Button } from '../components/ui';
import { listen } from '@tauri-apps/api/event';

const AppLayout = () => {
  const [currentView, setCurrentView] = useState('templates');
  const { currentTemplate, setCurrentTemplate, clearCurrentSession } = usePlaygroundStore();
  
  // Create a stable callback function that won't change between renders
  const handleTemplateFromStore = useCallback((template) => {
    if (!currentTemplate) {
      clearCurrentSession();
      setCurrentTemplate(template);
    }
  }, [currentTemplate, clearCurrentSession, setCurrentTemplate]);
  
  // Listen for spotlight-hidden event
  useEffect(() => {

    const setupListener = async () => {
      const unlisten = await listen('spotlight-hidden', () => {
        console.log('Spotlight hidden event received in main app - switching to playground view');
        
        // Add a small delay to ensure the main window is focused before processing
        setTimeout(() => {
          // Check if we have a template from localStorage as a backup
          try {
            const savedTemplate = localStorage.getItem('lastSelectedTemplate');
            if (savedTemplate) {
              const parsedTemplate = JSON.parse(savedTemplate);
              
              // Use the stored function to handle template
              handleTemplateFromStore(parsedTemplate);
              
              // Remove from localStorage to avoid using it again
              localStorage.removeItem('lastSelectedTemplate');

              // When spotlight is hidden after template selection, switch to playground view
              setCurrentView('playground');
            }
          } catch (e) {
            console.error('Error retrieving template from localStorage:', e);
          }
        }, 100); // Small delay to ensure window focus is complete
      });
      
      return () => {
        unlisten();
      };
    };
    
    setupListener();
  }, [handleTemplateFromStore]);

  const handleNewSession = () => {
    clearCurrentSession();
    setCurrentView('templates');
  };

  const renderNavigation = () => (
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
            </button>            <button
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
        </div>        <div className="flex items-center space-x-3">
          {currentTemplate && (
            <div className="hidden md:flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <span className="font-medium">Active:</span> 
              <span className="ml-1 truncate max-w-32">{currentTemplate.name}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewSession}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Session
          </Button>
        </div>
      </div>
    </div>
  );  
  const renderContent = () => {
    switch (currentView) {
      case 'templates':
        return <TemplateLibrary />;
      case 'playground':
        return <Playground />;
      case 'vault':
        return <PromptVault setCurrentView={setCurrentView} />;
      default:
        return <TemplateLibrary />;
  }
  };return (
    <div className="min-h-screen bg-gray-50">
      <SemanticSearch setCurrentView={setCurrentView}/>
      {renderNavigation()}
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Quick Actions Sidebar */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {currentTemplate && currentView !== 'playground' && (
          <Button
            onClick={() => setCurrentView('playground')}
            className="shadow-lg"
          >
            Go to Playground
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppLayout;
