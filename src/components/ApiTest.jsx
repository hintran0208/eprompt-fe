import { useState } from 'react';
import { getRefineTypes, generatePrompt } from '../lib/api';
import { Button, Card } from './ui';

const ApiTest = () => {
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testGetRefineTypes = async () => {
    setIsLoading(true);
    try {
      const types = await getRefineTypes();
      setResults(JSON.stringify(types, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGeneratePrompt = async () => {
    setIsLoading(true);
    try {
      const template = {
        name: 'Test Template',
        requiredFields: ['topic']
      };
      const input = { topic: 'test topic' };
      const { prompt }= await generatePrompt(template, input);
      setResults(prompt);
    } catch (error) {
      setResults(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 m-4">
      <h3 className="text-lg font-semibold mb-4">API Test Component</h3>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testGetRefineTypes} 
            disabled={isLoading}
          >
            Test Refine Types
          </Button>
          <Button 
            onClick={testGeneratePrompt} 
            disabled={isLoading}
          >
            Test Generate Prompt
          </Button>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <pre className="text-sm overflow-auto max-h-96">
            {isLoading ? 'Loading...' : results || 'No results yet'}
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default ApiTest;
