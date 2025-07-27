import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useToast } from '../hooks'
import { Button, Input } from './ui'
import { searchPrompts } from '../lib/api'
import { usePlaygroundStore } from '../store/playgroundStore'
import { generateAIContent } from '../lib/api';
import { invoke } from '@tauri-apps/api/core';

const SemanticSearch = ({ setCurrentView }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const containerRef = useRef(null)
  // Close search results and advanced dropdown when clicking outside
  useEffect(() => {
    if (!searchResults && !showAdvancedSearch) return
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSearchResults(null)
        setShowAdvancedSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchResults, showAdvancedSearch])

  const { templates, setCurrentTemplate, loadVaultItem, setActiveTab } = usePlaygroundStore()

  const toast = useToast()

  const PREFIXES = [
    'template',
    'vault',
    'initial-prompt',
    'refined-prompt',
    'content',
  ]

  const isValidQuery = (query) => {
    const prefixes = PREFIXES.map((prefix) => `${prefix}:`)
    let remainingQuery = query;

    prefixes.forEach((prefix) => {
      if (remainingQuery.includes(prefix)) {
        remainingQuery = remainingQuery.replace(prefix, '');
      }
    })

    return remainingQuery.trim().length > 0
  }

  const handleAddPrefix = (prefix) => {
    const prefixWithColon = `${prefix}:`

    if (searchQuery.includes(prefixWithColon)) {
      setSearchQuery(searchQuery.replace(`${prefixWithColon}`, ''))
    } else {
      setSearchQuery(`${prefixWithColon}${searchQuery}`.trim())
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setShowAdvancedSearch(false) // Hide advanced dropdown when showing results
    try {
      // Call the search API with the query
      const response = await searchPrompts(searchQuery)
      console.log('API Response:', response)
      setSearchResults(response)
    } catch (error) {
      console.error('Error during search:', error)
      // Show placeholder message using toast
      toast.error('Error during search', 6000)
    }
    setIsSearching(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleSelectTemplate = (result) => {
    setSearchQuery('')
    setCurrentTemplate(result)
    setSearchResults(null)
    setCurrentView('playground')
  }

  const handleSelectVaultItem = (result) => {
    setSearchQuery('')
    setCurrentTemplate(templates.find(t => t.id === result.templateId))
    loadVaultItem(result)
    setCurrentView('playground')

    let activeTab = 'form'
    if (result.generatedContent) {
      activeTab = 'content'
    } else if (result.refinedPrompt) {
      activeTab = 'refined-prompt'
    } else if (result.initialPrompt) {
      activeTab = 'initial-prompt'
    }

    setActiveTab(activeTab)
    setSearchResults(null)
  }

  const renderRole = (prefix, result) => {
    if (prefix === 'template') {
      return (
        <span className='bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded'>
          {result.role}
        </span>
      )
    }
    return null
  }

  const renderTags = (prefix, result) => {
    if (prefix === 'template') {
      return (
        <>
          {result.tags?.map((tag, index) => (
            <span
              key={index}
              className='bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded'
            >
              {tag}
            </span>
          ))}
        </>
      )
    }

    return null;
  }

  const renderDescription = (prefix, result) => {
    switch (prefix) {
      case 'template':
        return result.description
      case 'vault':
        return result.description
      case 'initial-prompt':
        return result.initialPrompt
      case 'refined-prompt':
        return result.refinedPrompt
      case 'content':
        return result.generatedContent
      default:
        return ''
    }
  }


  const SkeletonHeader = () => (
    <div className="bg-gray-300 px-3 py-2 rounded-t animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded" />
    </div>
  );

  const SkeletonResult = () => (
    <li className="p-2 border-b border-gray-200 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-12 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mt-2" />
    </li>
  );

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-md z-50 w-full max-w-4xl">
          <ul className="max-h-95 overflow-y-auto">
            <li className="mb-4">
              <div className="border border-gray-300 rounded">
                <SkeletonHeader />
                <ul>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <SkeletonResult key={idx} />
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      );
    }
    return Object.keys(searchResults).some(
      (key) => PREFIXES.includes(key) && searchResults[key]?.length > 0
    ) ? (
      <div className='absolute mt-2 bg-white border border-gray-300 rounded shadow-md z-50 w-full max-w-4xl'>
        <ul className='max-h-95 overflow-y-auto'>
          {PREFIXES.map(
            (prefix) =>
              searchResults[prefix]?.length > 0 && (
                <li key={prefix} className='mb-4'>
                  <div className='border border-gray-300 rounded'>
                    {/* Header */}
                    <div className='font-bold text-lg text-gray-800 capitalize bg-gray-300 px-3 py-2 rounded-t'>
                      {prefix.replace('-', ' ')}
                    </div>
                    {/* Results */}
                    <ul>
                      {searchResults[prefix].map(
                        (result, index) => (
                          <li
                            key={index}
                            className={`p-2 hover:bg-gray-100 cursor-pointer ${index <
                                searchResults[
                                  prefix
                                ].length -
                                1
                                ? 'border-b border-gray-200'
                                : ''
                              }`}
                            onClick={
                              prefix ===
                                'template'
                                ? () =>
                                  handleSelectTemplate(
                                    result
                                  )
                                : () => {
                                  handleSelectVaultItem(
                                    result
                                  )
                                }
                            }
                          >
                            <div className='flex items-center gap-2'>
                              <span className='font-semibold text-base'>
                                {prefix === 'template' ? result.name : `${result.name} - ${result.templateName}`}
                              </span>
                              {renderRole(
                                prefix,
                                result
                              )}
                              {renderTags(
                                prefix,
                                result
                              )}
                              {typeof result.score ===
                                'number' && (
                                  <span className='bg-green-100 text-green-700 text-xs px-2 py-1 rounded'>
                                    Matching Score:{' '}
                                    {(result.score * 100).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}%
                                  </span>
                                )}
                            </div>
                            <div className='text-sm text-gray-600 mt-1 truncate'>
                              {renderDescription(
                                prefix,
                                result
                              )}
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </li>
              )
          )}
        </ul>
      </div>
    ) : (
      <div className='absolute mt-2 bg-white border border-gray-300 rounded shadow-md z-50 w-full max-w-4xl p-4 text-gray-500 text-center'>
        No results found.
      </div>
    );
  };

  return (
    <div
      className='bg-white border-b border-gray-200 p-4'
      ref={containerRef}
    >
      <div className='max-w-4xl mx-auto'>
        <div className='flex gap-3 relative'>
          <div className='flex-1'>
            <Input
              placeholder='Search prompts and templates with natural language...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className='text-base'
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !isValidQuery(searchQuery)}
            className='px-6'
          >
            {isSearching ? (
              <div className='flex items-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Searching...
              </div>
            ) : (
              <>
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
                Search
              </>
            )}
          </Button>
          <Button
            onClick={() =>
              setShowAdvancedSearch(!showAdvancedSearch)
            }
            className='px-6'
          >
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6 6V20a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7.293l-6-6A1 1 0 013 6V4z'
              />
            </svg>
            Advanced
          </Button>
          {showAdvancedSearch && (
            <div className='absolute top-full mt-2 bg-white border border-gray-300 rounded shadow-md z-50 w-full p-4'>
              <div className='mb-4 text-xs text-gray-500 text-center'>
                Use the prefixes below to refine your search
                results.
              </div>
              <div className='flex flex-wrap gap-4'>
                {PREFIXES.map((prefix) => (
                  <label
                    key={prefix}
                    className='flex items-center gap-2 p-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      checked={searchQuery.includes(
                        `${prefix}:`
                      )}
                      onChange={() =>
                        handleAddPrefix(prefix)
                      }
                      className='cursor-pointer'
                    />
                    <span className='text-sm font-medium cursor-pointer'>
                      {prefix}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Hide advanced dropdown when search results are shown */}
        {!showAdvancedSearch && (isSearching || searchResults) && renderSearchResults()}
        <div className='mt-2 text-xs text-gray-500'>
          Try searching for &quot;content writing&quot;, &quot;code
          review&quot;, or &quot;email templates&quot;
        </div>
      </div>
    </div>
  )
}
SemanticSearch.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
}

export default SemanticSearch
