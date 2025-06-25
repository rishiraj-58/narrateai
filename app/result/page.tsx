'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { generateContent } from '@/lib/api'

interface GeneratedContent {
  script: string
  references: Array<{
    title: string
    url: string
    description: string
  }>
  images: Array<{
    url: string
    alt: string
    description: string
  }>
  videos: Array<{
    id: string
    title: string
    description: string
    thumbnail: string
    channelTitle: string
    publishedAt: string
    viewCount?: string
    duration?: string
  }>
  summary: string
}

export default function ResultPage() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic')
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!topic) {
      setError('No topic provided')
      setIsLoading(false)
      return
    }

    const fetchContent = async () => {
      try {
        setIsLoading(true)
        const result = await generateContent(topic)
        setContent(result)
      } catch (err) {
        setError('Failed to generate content. Please try again.')
        console.error('Error generating content:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [topic])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatViewCount = (viewCount?: string) => {
    if (!viewCount) return ''
    const count = parseInt(viewCount)
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    }
    return `${count} views`
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/" className="btn-primary">Go Back Home</a>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Generating Results</h1>
          <p className="text-gray-600 mb-4">Creating content for: <span className="font-semibold text-primary-600">"{topic}"</span></p>
          <p className="text-sm text-gray-500">This may take a few moments...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Generated Content</h1>
          <p className="text-gray-600">Topic: <span className="font-semibold text-primary-600">{topic}</span></p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Script */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Script</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content.script}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{content.summary}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* YouTube Videos */}
            {content.videos && content.videos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Related Videos</h2>
                <div className="space-y-4">
                  {content.videos.map((video, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                          <a 
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-600 transition-colors"
                          >
                            {video.title}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{video.channelTitle}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatViewCount(video.viewCount)}</span>
                          <span>{formatDate(video.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">References</h2>
              <div className="space-y-3">
                {content.references.map((ref, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4">
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium block mb-1"
                    >
                      {ref.title}
                    </a>
                    <p className="text-sm text-gray-600">{ref.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Suggested Images</h2>
              <div className="space-y-3">
                {content.images.map((image, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <img 
                      src={image.url} 
                      alt={image.alt}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="text-sm font-medium text-gray-800 mb-1">{image.alt}</p>
                    <p className="text-xs text-gray-600">{image.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <button className="btn-primary mr-4">Download Script</button>
          <button className="btn-secondary mr-4">Share Results</button>
          <a href="/" className="btn-secondary">Generate New Content</a>
        </div>
      </div>
    </div>
  )
} 