import React from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import Card from './ui/Card';
import Button from './ui/Button';

const PromptVault = () => {
  const { sessions, loadSession, deleteSession, currentTemplate } = usePlaygroundStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleLoadSession = (sessionId) => {
    loadSession(sessionId);
  };

  const handleDeleteSession = (sessionId, event) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
    }
  };

  const getSessionStatus = (session) => {
    if (session.generatedContent) return { label: 'Complete', color: 'green' };
    if (session.refinedPrompt) return { label: 'Refined', color: 'blue' };
    if (session.generatedPrompt) return { label: 'Generated', color: 'yellow' };
    return { label: 'Draft', color: 'gray' };
  };

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prompt Vault</h2>
          <p className="text-gray-600">
            Your saved prompt sessions will appear here
          </p>
        </div>

        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Yet</h3>
          <p className="text-gray-500">
            Generate your first prompt in the playground to see it here.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Prompt Vault</h2>
        <p className="text-gray-600">
          Browse and reload your previous prompt sessions
        </p>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const status = getSessionStatus(session);
          const isCurrentSession = currentTemplate?.id === session.templateId;
          
          return (
            <Card 
              key={session.id} 
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isCurrentSession ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleLoadSession(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {session.templateName}
                    </h3>
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${status.color === 'green' ? 'bg-green-100 text-green-800' :
                        status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {status.label}
                    </span>
                    {isCurrentSession && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(session.input).map(([key, value]) => (
                        <span key={key} className="inline-block">
                          <span className="font-medium">{key}:</span> {value}
                        </span>
                      ))}
                    </div>
                  </div>

                  {session.generatedPrompt && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Generated Prompt:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {session.generatedPrompt.substring(0, 150)}
                        {session.generatedPrompt.length > 150 ? '...' : ''}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Created: {formatDate(session.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadSession(session.id)}
                  >
                    Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sessions.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          {sessions.length} session{sessions.length === 1 ? '' : 's'} saved
        </div>
      )}
    </div>
  );
};

export default PromptVault;
