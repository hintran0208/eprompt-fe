import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from './ui'
import { getTrendingPrompts } from '../lib/api'
import useToast from '../hooks/useToast'
import { usePlaygroundStore } from '../store/playgroundStore'

const SkeletonCard = () => {
  return (
    <Card className='p-6 animate-pulse'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2 mb-3'></div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-8 w-20 bg-gray-200 rounded-full'></div>
        </div>
      </div>
      <div className='h-20 bg-gray-200 rounded mb-4'></div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='h-4 w-16 bg-gray-200 rounded'></div>
          <div className='h-4 w-16 bg-gray-200 rounded'></div>
        </div>
        <div className='h-8 w-24 bg-gray-200 rounded'></div>
      </div>
    </Card>
  )
}

const TrendingPrompts = () => {
  const [trendingPrompts, setTrendingPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('daily')
  const [category, setCategory] = useState('all')
  const navigate = useNavigate()
  const toast = useToast()
  const { loadVaultItem } = usePlaygroundStore()

  const fetchTrendingPrompts = async () => {
    setLoading(true)
    try {
      const response = await getTrendingPrompts(filter, category)
      setTrendingPrompts(response || [])
    } catch (error) {
      toast.error('Failed to fetch trending prompts', error.message)
      setTrendingPrompts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingPrompts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, category])

  const handleUsePrompt = async (prompt) => {
    // Load the prompt into the playground
    const vaultItem = {
      name: prompt.name,
      description: prompt.description,
      initialPrompt: prompt.prompt,
      category: prompt.category,
      tags: prompt.tags,
    }
    
    await loadVaultItem(vaultItem)
    usePlaygroundStore.getState().setActiveTab('initial-prompt')
    navigate('/prompts')
  }

  const categories = ['all', 'Marketing', 'Development', 'Writing', 'Business', 'Education', 'Creative', 'Technical']
  const timeFilters = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'all-time', label: 'All Time' },
  ]

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>
          🔥 Trending Prompts
        </h2>
        <p className='text-gray-600'>
          Discover the most popular and effective prompts from the community
        </p>
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-4'>
        {/* Time Filter */}
        <div className='flex items-center gap-2'>
          {timeFilters.map(time => (
            <Button
              key={time.value}
              variant={filter === time.value ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setFilter(time.value)}
            >
              {time.label}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className='flex items-center gap-2 flex-wrap'>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={category === cat ? 'primary' : 'ghost'}
              size='sm'
              onClick={() => setCategory(cat)}
              className={category === cat ? '' : 'text-gray-600 hover:text-gray-900'}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Trending Prompts Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
        ) : trendingPrompts.length === 0 ? (
          <Card className='col-span-full p-12 text-center'>
            <div className='text-gray-400 mb-4'>
              <svg
                className='mx-auto h-16 w-16'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No Trending Prompts Yet
            </h3>
            <p className='text-gray-500'>
              Check back later for trending prompts in this category.
            </p>
          </Card>
        ) : (
          trendingPrompts.map((prompt, idx) => (
            <Card key={prompt.id || idx} className='p-6 hover:shadow-lg transition-shadow'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                    {prompt.name}
                  </h3>
                  {prompt.category && (
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                      {prompt.category}
                    </span>
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  <span className='inline-flex items-center text-sm text-gray-500'>
                    <svg
                      className='w-4 h-4 mr-1 text-yellow-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    {prompt.uses || 0}
                  </span>
                </div>
              </div>

              {prompt.description && (
                <p className='text-sm text-gray-600 mb-4 line-clamp-3'>
                  {prompt.description}
                </p>
              )}

              <div className='border-t pt-4'>
                <p className='text-xs text-gray-500 mb-3'>Preview:</p>
                <p className='text-sm text-gray-700 line-clamp-4 mb-4'>
                  {prompt.prompt}
                </p>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  <span className='flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                      />
                    </svg>
                    {prompt.likes || 0}
                  </span>
                  <span className='flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                      />
                    </svg>
                    {prompt.comments || 0}
                  </span>
                </div>
                <Button
                  variant='primary'
                  size='sm'
                  onClick={() => handleUsePrompt(prompt)}
                >
                  Use Prompt
                </Button>
              </div>

              {prompt.tags && prompt.tags.length > 0 && (
                <div className='mt-4 pt-4 border-t'>
                  <div className='flex flex-wrap gap-2'>
                    {prompt.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700'
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Pagination or Load More */}
      {!loading && trendingPrompts.length > 0 && (
        <div className='flex justify-center pt-6'>
          <Button
            variant='outline'
            onClick={fetchTrendingPrompts}
            className='flex items-center'
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
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

export default TrendingPrompts