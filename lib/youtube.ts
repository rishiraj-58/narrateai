import { google } from 'googleapis'

// Configure YouTube API
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  viewCount?: string
  duration?: string
}

export async function searchVideos(query: string, maxResults: number = 5): Promise<YouTubeVideo[]> {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured')
    }

    // Search for videos
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: query,
      type: ['video'],
      maxResults: maxResults,
      order: 'relevance',
      videoDuration: 'medium', // Filter for medium length videos (4-20 minutes)
      relevanceLanguage: 'en'
    })

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return []
    }

    // Get video IDs for detailed information
    const videoIds = searchResponse.data.items.map(item => item.id?.videoId).filter(Boolean) as string[]

    // Get detailed video information including statistics
    const videoResponse = await youtube.videos.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      id: videoIds
    })

    if (!videoResponse.data.items) {
      return []
    }

    // Map the response to our interface
    const videos: YouTubeVideo[] = videoResponse.data.items.map(video => ({
      id: video.id!,
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url || '',
      channelTitle: video.snippet?.channelTitle || '',
      publishedAt: video.snippet?.publishedAt || '',
      viewCount: video.statistics?.viewCount,
      duration: video.contentDetails?.duration
    }))

    return videos
  } catch (error) {
    console.error('Error searching YouTube videos:', error)
    throw new Error('Failed to search YouTube videos')
  }
}

// Helper function to format duration from ISO 8601 format
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return 'Unknown'
  
  const hours = (match[1] || '').replace('H', '')
  const minutes = (match[2] || '').replace('M', '')
  const seconds = (match[3] || '').replace('S', '')
  
  let result = ''
  if (hours) result += `${hours}:`
  if (minutes) result += `${minutes.padStart(2, '0')}:`
  else result += '00:'
  if (seconds) result += seconds.padStart(2, '0')
  else result += '00'
  
  return result
}

// Helper function to format view count
export function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount)
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`
  }
  return `${count} views`
} 