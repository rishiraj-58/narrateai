import { NextRequest, NextResponse } from 'next/server'
import { searchVideos, YouTubeVideo } from '@/lib/youtube'
import { fetchMultipleWikipediaSummaries, WikipediaSummary } from '@/lib/wikipedia'

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()
    
    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Fetch YouTube videos related to the topic
    let videos: YouTubeVideo[] = []
    try {
      videos = await searchVideos(topic.trim(), 3) // Get 3 videos
    } catch (videoError) {
      console.error('Error fetching videos:', videoError)
      // Continue without videos if there's an error
    }

    // Fetch multiple Wikipedia summaries
    let wikipediaData: WikipediaSummary[] = []
    try {
      wikipediaData = await fetchMultipleWikipediaSummaries(topic.trim(), 3) // Get 3 summaries
    } catch (wikiError) {
      console.error('Error fetching Wikipedia summaries:', wikiError)
      // Continue without Wikipedia data if there's an error
    }

    // Dummy data structure with enhanced content
    const response = {
      script: `This is a comprehensive script for the topic: ${topic}.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Curabitur nec felis tristique, aliquet nunc vitae, tincidunt nisi. Sed euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.`,
      summary: `A detailed summary about ${topic} covering key points and insights.`,
      references: [
        {
          title: 'Reference Article 1',
          url: 'https://example.com/article1',
          description: 'A relevant article about the topic with comprehensive information.'
        },
        {
          title: 'Reference Article 2',
          url: 'https://example.com/article2',
          description: 'Another authoritative source for further reading and research.'
        }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
          alt: `${topic} illustration 1`,
          description: 'A relevant high-quality image for the topic.'
        },
        {
          url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
          alt: `${topic} illustration 2`,
          description: 'Another visual suggestion that complements the content.'
        }
      ],
      videos: videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description.substring(0, 150) + '...',
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        publishedAt: video.publishedAt,
        viewCount: video.viewCount,
        duration: video.duration
      })),
      wikipedia: wikipediaData.map(summary => ({
        title: summary.title,
        summary: summary.summary,
        url: summary.url,
        thumbnail: summary.thumbnail
      }))
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in /api/generate:', error)
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    )
  }
} 