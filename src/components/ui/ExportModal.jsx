import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from './index';

const ExportModal = ({ isOpen, onClose, onExport, availableContent, preSelectedContent = null }) => {
  const [selectedFormat, setSelectedFormat] = useState('txt');
  const [enableMarkdown, setEnableMarkdown] = useState(false);
  const [selectedContent, setSelectedContent] = useState({
    basicPrompt: !!availableContent.basicPrompt,
    refinedPrompt: !!availableContent.refinedPrompt,
    generatedContent: !!availableContent.generatedContent,
  });
  const [isExporting, setIsExporting] = useState(false);

  // Update selected content when preSelectedContent changes
  useEffect(() => {
    if (preSelectedContent && isOpen) {
      setSelectedContent({
        basicPrompt: !!preSelectedContent.basicPrompt,
        refinedPrompt: !!preSelectedContent.refinedPrompt,
        generatedContent: !!preSelectedContent.generatedContent,
      });
    } else if (isOpen) {
      // Default to select all available content when opening without pre-selection
      setSelectedContent({
        basicPrompt: !!availableContent.basicPrompt,
        refinedPrompt: !!availableContent.refinedPrompt,
        generatedContent: !!availableContent.generatedContent,
      });
    }
  }, [preSelectedContent, availableContent, isOpen]);

  const formatOptions = [
    { value: 'txt', label: 'Text File (.txt)', icon: '📄' },
    { value: 'pdf', label: 'PDF Document (.pdf)', icon: '📋' },
    { value: 'docx', label: 'Word Document (.docx)', icon: '📝' },
  ];

  const contentOptions = [
    { 
      key: 'basicPrompt', 
      label: 'Basic Prompt', 
      available: !!availableContent.basicPrompt,
      description: 'The original generated prompt'
    },
    { 
      key: 'refinedPrompt', 
      label: 'Refined Prompt', 
      available: !!availableContent.refinedPrompt,
      description: 'The AI-refined version of your prompt'
    },
    { 
      key: 'generatedContent', 
      label: 'Generated Content', 
      available: !!availableContent.generatedContent,
      description: 'Content generated from your prompt'
    },
  ];

  const handleContentToggle = (contentKey) => {
    setSelectedContent(prev => ({
      ...prev,
      [contentKey]: !prev[contentKey]
    }));
  };

  const handleExport = async () => {
    const hasSelectedContent = Object.values(selectedContent).some(selected => selected);
    if (!hasSelectedContent) {
      return;
    }

    setIsExporting(true);
    try {
      const dataToExport = {};
      
      if (selectedContent.basicPrompt && availableContent.basicPrompt) {
        dataToExport.basicPrompt = availableContent.basicPrompt;
      }
      if (selectedContent.refinedPrompt && availableContent.refinedPrompt) {
        dataToExport.refinedPrompt = availableContent.refinedPrompt;
      }
      if (selectedContent.generatedContent && availableContent.generatedContent) {
        dataToExport.generatedContent = availableContent.generatedContent;
      }

      const exportOptions = {
        enableMarkdown: enableMarkdown && (selectedFormat === 'pdf' || selectedFormat === 'docx'),
        baseFilename: 'eprompt-export'
      };

      await onExport(dataToExport, selectedFormat, exportOptions);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const hasSelectedContent = Object.values(selectedContent).some(selected => selected);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Export Content</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Content Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Select Content to Export</h3>
              <div className="space-y-3">
                {contentOptions.map((option) => (
                  <div
                    key={option.key}
                    className={`border rounded-lg p-4 transition-colors ${
                      option.available 
                        ? 'border-gray-200 hover:border-gray-300' 
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <label className={`flex items-start cursor-pointer ${!option.available ? 'cursor-not-allowed' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedContent[option.key] && option.available}
                        onChange={() => option.available && handleContentToggle(option.key)}
                        disabled={!option.available}
                        className="mt-1 mr-3 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${option.available ? 'text-gray-900' : 'text-gray-400'}`}>
                          {option.label}
                        </div>
                        <div className={`text-sm ${option.available ? 'text-gray-600' : 'text-gray-400'}`}>
                          {option.description}
                        </div>
                        {!option.available && (
                          <div className="text-xs text-gray-400 mt-1">
                            Not available - content not generated yet
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Select Export Format</h3>
              <div className="grid gap-3">
                {formatOptions.map((format) => (
                  <label
                    key={format.value}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={selectedFormat === format.value}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-2xl mr-3">{format.icon}</span>
                    <span className="font-medium text-gray-900">{format.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Markdown Formatting Option */}
            {(selectedFormat === 'pdf' || selectedFormat === 'docx') && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Formatting Options</h3>
                <div className="border rounded-lg p-4">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableMarkdown}
                      onChange={(e) => setEnableMarkdown(e.target.checked)}
                      className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Enable Markdown Formatting
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Apply rich formatting to headers, bold text, and other markdown elements in the exported document. 
                        This will format headings with # as proper document headers and **bold** text as bold formatting.
                      </div>
                      <div className="text-xs text-blue-600 mt-2">
                        Supports: Headers (# ## ###), Bold (**text**), Italic (*text*)
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Preview */}
            {hasSelectedContent && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Export Preview</h4>
                <div className="text-sm text-gray-600">
                  <div>Format: <span className="font-medium">{formatOptions.find(f => f.value === selectedFormat)?.label}</span></div>
                  {(selectedFormat === 'pdf' || selectedFormat === 'docx') && (
                    <div>Formatting: <span className="font-medium">{enableMarkdown ? 'Rich (Markdown)' : 'Plain Text'}</span></div>
                  )}
                  <div>Content sections: <span className="font-medium">{Object.values(selectedContent).filter(Boolean).length}</span></div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Sections to include:</div>
                    <ul className="text-xs text-gray-600 mt-1 space-y-1">
                      {Object.entries(selectedContent).map(([key, selected]) => {
                        if (!selected) return null;
                        const option = contentOptions.find(opt => opt.key === key);
                        return <li key={key}>• {option?.label}</li>;
                      })}
                    </ul>
                  </div>
                  {enableMarkdown && (selectedFormat === 'pdf' || selectedFormat === 'docx') && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <div className="text-blue-800 font-medium">Markdown formatting enabled:</div>
                      <div className="text-blue-700">Headers, bold text, and other markdown elements will be properly formatted</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!hasSelectedContent || isExporting}
              className="flex items-center"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  availableContent: PropTypes.shape({
    basicPrompt: PropTypes.string,
    refinedPrompt: PropTypes.string,
    generatedContent: PropTypes.string,
  }).isRequired,
  preSelectedContent: PropTypes.shape({
    basicPrompt: PropTypes.string,
    refinedPrompt: PropTypes.string,
    generatedContent: PropTypes.string,
  }),
};

export default ExportModal;
