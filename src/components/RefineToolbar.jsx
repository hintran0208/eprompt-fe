import React, { useState, useEffect } from 'react';
import { getRefineTypes } from '../lib/api';
import Button from './ui/Button';

const RefineToolbar = ({ onRefine, isLoading, mode }) => {
  const [tools, setTools] = useState([]);
  const [loadingTools, setLoadingTools] = useState(true);

  useEffect(() => {
    const loadTools = async () => {
      setLoadingTools(true);
      try {
        const refineTypes = await getRefineTypes();
        const toolsData = mode === 'prompt' ? refineTypes.prompt : refineTypes.content;
        setTools(toolsData.tools || []);
      } catch (error) {
        console.error('Failed to load refine types:', error);
        // Set empty array as fallback - no default tools
        setTools([]);
      } finally {
        setLoadingTools(false);
      }
    };

    loadTools();
  }, [mode]);  const getButtonColor = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
      green: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200',
      orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200',
      gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200',
      purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200',
      cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border-cyan-200',
      red: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200',
      navy: 'bg-blue-200 text-blue-900 hover:bg-blue-300 border-blue-300',
      pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200',
      indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200',
    };
    return colorMap[color] || colorMap.gray;
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {mode === 'prompt' ? 'Refine Prompt' : 'Refine Content'}
      </h3>
      
      {loadingTools ? (
        <div className="text-center text-sm text-gray-500 py-8">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Loading refinement tools...
          </div>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-8">
          <p>No refinement tools available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onRefine(tool.id)}
                disabled={isLoading}
                className={`
                  flex flex-col items-center p-3 rounded-lg border-2 transition-all
                  ${getButtonColor(tool.color)}
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isLoading ? 'animate-pulse' : ''}
                `}
                title={tool.description}
              >
                <span className="text-xl mb-1">{tool.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center text-sm text-gray-500">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Refining...
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RefineToolbar;
