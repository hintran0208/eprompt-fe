import { useState } from 'react';
import { useToast } from '../hooks';
import { Button, Input } from './ui';

const SemanticSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const toast = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      // Show placeholder message using toast
      toast.info('🔍 Semantic search coming soon! This feature will allow you to search through prompts and templates using natural language.', 6000);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search prompts and templates with natural language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-base"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-6"
          >
            {isSearching ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Try searching for &quot;content writing&quot;, &quot;code review&quot;, or &quot;email templates&quot;
        </div>
      </div>
    </div>
  );
};

export default SemanticSearch;
