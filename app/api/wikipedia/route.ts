import { NextRequest, NextResponse } from 'next/server'
import { fetchWikipediaSummary, searchWikipediaArticles } from '@/lib/wikipedia'

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

    // Fetch Wikipedia summary (now includes search functionality)
    const summary = await fetchWikipediaSummary(topic.trim())

    return NextResponse.json({
      ...summary,
      topic: topic.trim()
    })

  } catch (error) {
    console.error('Error in /api/wikipedia:', error)
    
    // Check if it's a "not found" error
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Wikipedia article not found for this topic' },
        { status: 404 }
      )
    }

    // Check if it's a "no articles found" error
    if (error instanceof Error && error.message.includes('No Wikipedia articles found')) {
      return NextResponse.json(
        { error: 'No Wikipedia articles found for this topic' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch Wikipedia summary. Please try again later.' },
      { status: 500 }
    )
  }
}

// Add a separate endpoint for just searching articles
export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic parameter is required' },
        { status: 400 }
      )
    }

    // Search for Wikipedia articles
    const searchResults = await searchWikipediaArticles(topic.trim())

    return NextResponse.json({
      results: searchResults,
      topic: topic.trim(),
      count: searchResults.length
    })

  } catch (error) {
    console.error('Error in /api/wikipedia search:', error)
    
    return NextResponse.json(
      { error: 'Failed to search Wikipedia articles. Please try again later.' },
      { status: 500 }
    )
  }
} 