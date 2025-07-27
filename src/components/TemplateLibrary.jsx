import { useEffect, useState } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import { Button, Card } from './ui';
import { getAllTemplates } from '../lib/api';
import { useToast } from '../hooks';


const TemplateLibrary = () => {
  const { setCurrentTemplate, currentTemplate } = usePlaygroundStore();
  const [templates, setTemplates] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAllTemplates();
        setTemplates(data);
        toast.success('Successfully got all templates from database', 500);
      } catch (err) {
        toast.error(`Failed to load templates: ${err.message}`);
      }
    };
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectTemplate = (template) => {
    setCurrentTemplate(template);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Library</h2>
        <p className="text-gray-600">
          Choose a template to get started with prompt generation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {template.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1 flex-wrap">
                  {template.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-500">
                  <span className="font-medium">Role:</span> {template.role}
                </div>

                <div className="text-xs text-gray-500">
                  <span className="font-medium">Required fields:</span>{' '}
                  {template.requiredFields.join(', ')}
                </div>

                {template.optionalFields && template.optionalFields.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Optional fields:</span>{' '}
                    {template.optionalFields.join(', ')}
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleSelectTemplate(template)}
                variant={currentTemplate?.id === template.id ? 'primary' : 'outline'}
                className="w-full"
              >
                {currentTemplate?.id === template.id ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Selected
                  </span>
                ) : (
                  'Select Template'
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;
