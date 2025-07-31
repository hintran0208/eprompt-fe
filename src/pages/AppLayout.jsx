import { useState, useEffect, useCallback } from 'react';
import SemanticSearch from '../components/SemanticSearch';
import TemplateLibrary from '../components/TemplateLibrary';
import Playground from '../components/Playground';
import PromptVault from '../components/PromptVault';
import { usePlaygroundStore } from '../store/playgroundStore';
import { Button } from '../components/ui';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

const AppLayout = () => {
  const [currentView, setCurrentView] = useState('templates');
  const { currentTemplate, setCurrentTemplate, clearCurrentSession, loadVaultItem, setActiveTab, templates } = usePlaygroundStore();
  
  // Create a stable callback function that won't change between renders
  const handleTemplateFromStore = useCallback((template, vaultItem) => {
    if (!currentTemplate) {
      clearCurrentSession();
      setCurrentTemplate(template);
      if (vaultItem) {
        console.log('Loading vault item:', vaultItem);
        loadVaultItem(vaultItem);
      }
    }
  }, [currentTemplate, clearCurrentSession, setCurrentTemplate, loadVaultItem]);

  // Listen for spotlight-hidden event
  useEffect(() => {

    const setupListener = async () => {
      const unlisten = await listen('spotlight-hidden', async () => {
        console.log('Spotlight hidden event received in main app');
        
        // First, ensure main window exists and try to activate the app
        try {
          console.log('Ensuring main window exists...');
          await invoke('ensure_main_window');
          console.log('Main window ensured');
          
          console.log('Attempting to activate app...');
          await invoke('activate_app');
          console.log('App activation command completed');
        } catch (e) {
          console.error('Error activating app:', e);
        }
        
        // Add a longer delay to ensure the main window is fully loaded before processing
        // This is especially important when the main window was just recreated
        const processTemplate = () => {
          console.log('Processing spotlight selection...');
          // Check if we have a template from localStorage as a backup
          try {
            const savedTemplate = localStorage.getItem('lastSelectedTemplate');
            const savedVaultItem = localStorage.getItem('lastSelectedVaultItem');
            
            if (savedTemplate) {
              const parsedTemplate = JSON.parse(savedTemplate);
              console.log('Loading template from spotlight:', parsedTemplate);
              
              // Use the stored function to handle template
              handleTemplateFromStore(parsedTemplate);
              
              // Remove from localStorage to avoid using it again
              localStorage.removeItem('lastSelectedTemplate');

              // When spotlight is hidden after template selection, switch to playground view
              setCurrentView('playground');
            }
            if (savedVaultItem) {
              const parsedVaultItem = JSON.parse(savedVaultItem);
              console.log('Loading vault item from spotlight:', parsedVaultItem);
              
              // Check if templates are loaded yet
              if (!templates || templates.length === 0) {
                console.log('Templates not loaded yet, waiting...');
                // If templates aren't loaded, wait a bit more and try again
                setTimeout(() => {
                  const retryTemplate = templates.find(t => t.id === parsedVaultItem.templateId);
                  if (retryTemplate) {
                    console.log('Templates loaded on retry, processing vault item');
                    handleTemplateFromStore(retryTemplate, parsedVaultItem);
                    setCurrentView('playground');
                    
                    let activeTab = 'form'
                    if (parsedVaultItem.generatedContent) {
                      activeTab = 'content';
                    } else if (parsedVaultItem.refinedPrompt) {
                      activeTab = 'refined-prompt';
                    } else if (parsedVaultItem.initialPrompt) {
                      activeTab = 'initial-prompt';
                    }
                    setActiveTab(activeTab);
                  } else {
                    console.error('Template not found even after retry:', parsedVaultItem.templateId);
                  }
                  // Remove from localStorage after processing (success or failure)
                  localStorage.removeItem('lastSelectedVaultItem');
                }, 1000); // Wait 1 more second for templates to load
                return; // Exit early, will be handled by the retry
              }
              
              const curTemplate = templates.find(t => t.id === parsedVaultItem.templateId);
              if (!curTemplate) {
                console.error('Template not found for vault item:', parsedVaultItem.templateId);
                localStorage.removeItem('lastSelectedVaultItem');
                return;
              }
              
              handleTemplateFromStore(curTemplate, parsedVaultItem);
              
              // Remove from localStorage to avoid using it again
              localStorage.removeItem('lastSelectedVaultItem');

              setCurrentView('playground');

              let activeTab = 'form'
              if (parsedVaultItem.generatedContent) {
                activeTab = 'content';
              } else if (parsedVaultItem.refinedPrompt) {
                activeTab = 'refined-prompt';
              } else if (parsedVaultItem.initialPrompt) {
                activeTab = 'initial-prompt';
              }

              setActiveTab(activeTab);
            }
          } catch (e) {
            console.error('Error retrieving template from localStorage:', e);
          }
        };
        
        // Check if window is ready, if not wait a bit more
        if (document.readyState === 'complete') {
          setTimeout(processTemplate, 500);
        } else {
          setTimeout(processTemplate, 1000); // Extra time if document isn't fully ready
        }
      });
      
      return () => {
        unlisten();
      };
    };
    
    setupListener();
  }, [handleTemplateFromStore, setActiveTab, templates]);

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
