import { useState } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import { generatePrompt, refinePrompt, generateAIContent, refineContent } from '../lib/api';
import { copyToClipboard } from '../lib/utils';
import { Button, Card, Input } from './ui';
import { useToast } from '../hooks';
import RefineToolbar from './RefineToolbar';

const Playground = () => {
  const {
    currentTemplate,
    currentInput,
    generatedPrompt,
    refinedPrompt,
    generatedContent,
    activeTab,
    isLoading,
    setCurrentInput,
    setGeneratedPrompt,
    setRefinedPrompt,
    setGeneratedContent,
    setActiveTab,
    setIsLoading,
    saveCurrentSession,
  } = usePlaygroundStore();

  const [formErrors, setFormErrors] = useState({});
  const toast = useToast();

  const handleInputChange = (field, value) => {
    setCurrentInput({ ...currentInput, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  const handleCopy = async (text, type) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${type} copied to clipboard!`);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const validateForm = () => {
    if (!currentTemplate) return false;
    
    const errors = {};
    
    currentTemplate.requiredFields.forEach(field => {
      if (!currentInput[field]?.trim()) {
        errors[field] = `${field} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };  const handleGeneratePrompt = async () => {
    if (!currentTemplate || !validateForm()) return;

    setIsLoading(true);
    try {
      const prompt = await generatePrompt(currentTemplate, currentInput);
      setGeneratedPrompt(prompt);
      saveCurrentSession();
      toast.success('Prompt generated successfully!');
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      toast.error('Failed to generate prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinePrompt = async (type) => {
    if (!generatedPrompt) return;

    setIsLoading(true);
    try {
      const refined = await refinePrompt(type, generatedPrompt);
      setRefinedPrompt(refined);
      saveCurrentSession();
      toast.success('Prompt refined successfully!');
    } catch (error) {
      console.error('Failed to refine prompt:', error);
      toast.error('Failed to refine prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineRefinedPrompt = async (type) => {
    if (!refinedPrompt) return;

    setIsLoading(true);
    try {
      const refined = await refinePrompt(type, refinedPrompt);
      setRefinedPrompt(refined);
      saveCurrentSession();
      toast.success('Prompt refined successfully!');
    } catch (error) {
      console.error('Failed to refine prompt:', error);
      toast.error('Failed to refine prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGenerateContent = async (useRefinedPrompt = false) => {
    const promptToUse = useRefinedPrompt && refinedPrompt ? refinedPrompt : generatedPrompt;
    if (!promptToUse) return;

    setIsLoading(true);
    try {
      const content = await generateAIContent(promptToUse, useRefinedPrompt);
      setGeneratedContent(content);
      saveCurrentSession();
      toast.success(`Content generated successfully from ${useRefinedPrompt ? 'refined' : 'basic'} prompt!`);
    } catch (error) {
      console.error('Failed to generate content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineContent = async (type) => {
    if (!generatedContent) return;

    setIsLoading(true);
    try {
      const refined = await refineContent(type, generatedContent);
      setGeneratedContent(refined);
      saveCurrentSession();
      toast.success('Content refined successfully!');
    } catch (error) {
      console.error('Failed to refine content:', error);
      toast.error('Failed to refine content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fill Template: {currentTemplate?.name}
        </h3>
        <p className="text-gray-600 mb-6">{currentTemplate?.description}</p>
      </div>

      <div className="space-y-4">
        {currentTemplate?.requiredFields.map(field => (
          <Input
            key={field}
            label={`${field} *`}
            placeholder={`Enter ${field}...`}
            value={currentInput[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            error={formErrors[field]}
          />
        ))}

        {currentTemplate?.optionalFields?.map(field => (
          <Input
            key={field}
            label={field}
            placeholder={`Enter ${field} (optional)...`}
            value={currentInput[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        ))}
      </div>

      <Button
        onClick={handleGeneratePrompt}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Generating...' : 'Generate Prompt'}
      </Button>
    </div>
  );
  const renderPrompt = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generated Prompt</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(generatedPrompt, 'Prompt')}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </Button>
        </div>
        <Card className="p-4 bg-gray-50">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">
            {generatedPrompt}
          </pre>
        </Card>
      </div>      <RefineToolbar
        onRefine={handleRefinePrompt}
        isLoading={isLoading}
        mode="prompt"
      />

      <div className="pt-4 border-t">
        <Button
          onClick={() => handleGenerateContent(false)}
          disabled={isLoading}
          variant="primary"
          className="w-full"
        >
          {isLoading ? 'Generating Content...' : 'Generate AI Content from Basic Prompt'}
        </Button>
      </div>
    </div>
  );
  const renderRefinedPrompt = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Refined Prompt</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(refinedPrompt, 'Refined Prompt')}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </Button>
        </div>
        <Card className="p-4 bg-green-50">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">
            {refinedPrompt}
          </pre>        </Card>
      </div>

      <RefineToolbar
        onRefine={handleRefineRefinedPrompt}
        isLoading={isLoading}
        mode="prompt"
      />

      <div className="pt-4 border-t">
        <Button
          onClick={() => handleGenerateContent(true)}
          disabled={isLoading}
          variant="primary"
          className="w-full"
        >
          {isLoading ? 'Generating Content...' : 'Generate AI Content from Refined Prompt'}
        </Button>
      </div>
    </div>
  );
  
  const renderContent = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(generatedContent, 'Content')}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </Button>
        </div>
        <Card className="p-4 bg-blue-50">
          <div className="text-sm text-gray-700 max-h-96 overflow-y-auto">
            {generatedContent}
          </div>
        </Card>
      </div>

      <RefineToolbar
        onRefine={handleRefineContent}
        isLoading={isLoading}
        mode="content"
      />
    </div>
  );

  const renderTabs = () => {
    const tabs = [
      { id: 'form', label: 'Form', enabled: true },
      { id: 'prompt', label: 'Prompt', enabled: !!generatedPrompt },
      { id: 'refined', label: 'Refined Prompt', enabled: !!refinedPrompt },
      { id: 'content', label: 'Generated Content', enabled: !!generatedContent },
    ];

    return (
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => tab.enabled && setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${tab.enabled
                  ? activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  : 'border-transparent text-gray-300 cursor-not-allowed'
                }
              `}
              disabled={!tab.enabled}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    );
  };
  if (!currentTemplate) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Template Selected</h3>
            <p className="text-gray-600 mb-6">
              Choose a template from the library to start generating and refining prompts
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h4 className="font-medium text-gray-900 mb-3">How it works:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center">1</span>
                <span>Select a template from the Template Library</span>
              </div>
              <div className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center">2</span>
                <span>Fill in the required fields for your template</span>
              </div>
              <div className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center">3</span>
                <span>Generate your initial prompt</span>
              </div>
              <div className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center">4</span>
                <span>Refine your prompt using AI-powered tools</span>
              </div>
              <div className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3 mt-0.5 flex items-center justify-center">5</span>
                <span>Generate content from your refined prompt</span>
              </div>
            </div>
          </div>          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Go to the Templates section to choose a template and get started
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Playground</h2>
        <p className="text-gray-600">
          Generate and refine prompts using the selected template
        </p>
      </div>

      <Card className="p-6">
        {renderTabs()}
        
        <div className="mt-6">
          {activeTab === 'form' && renderForm()}
          {activeTab === 'prompt' && renderPrompt()}
          {activeTab === 'refined' && renderRefinedPrompt()}
          {activeTab === 'content' && renderContent()}
        </div>
      </Card>
    </div>
  );
};

export default Playground;
