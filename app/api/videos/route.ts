import { NextRequest, NextResponse } from 'next/server'
import { searchVideos } from '@/lib/youtube'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic')

    // Validate topic parameter
    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic parameter is required' },
        { status: 400 }
      )
    }

    // Get maxResults from query params (optional, default is 5)
    const maxResults = parseInt(searchParams.get('maxResults') || '5')
    const validatedMaxResults = Math.min(Math.max(maxResults, 1), 10) // Limit between 1 and 10

    // Search for videos
    const videos = await searchVideos(topic.trim(), validatedMaxResults)

    return NextResponse.json({
      videos,
      topic: topic.trim(),
      count: videos.length
    })

  } catch (error) {
    console.error('Error in /api/videos:', error)
    
    // Check if it's a YouTube API error
    if (error instanceof Error && error.message.includes('YouTube API')) {
      return NextResponse.json(
        { error: 'YouTube API configuration error. Please check your API key.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch videos. Please try again later.' },
      { status: 500 }
    )
  }
} 