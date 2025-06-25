export interface WikipediaSummary {
  title: string
  summary: string
  url: string
  thumbnail?: string
}

export interface WikipediaSearchResult {
  title: string
  pageid: number
  snippet: string
}

export async function searchWikipediaArticles(query: string): Promise<WikipediaSearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query.trim())
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&srlimit=10&srsort=relevance`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NarrateAI/1.0 (https://narrateai.com; contact@narrateai.com)'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Wikipedia search API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.query?.search || data.query.search.length === 0) {
      return []
    }

    // Filter and sort results for better relevance
    const filteredResults = data.query.search
      .map((item: any) => ({
        title: item.title,
        pageid: item.pageid,
        snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''), // Remove HTML tags
        relevance: calculateRelevance(query, item.title, item.snippet)
      }))
      .filter((item: any) => {
        // Filter out disambiguation pages and very short articles
        const isDisambiguation = item.title.includes('(disambiguation)') || 
                                item.title.includes('(disambiguation)') ||
                                item.snippet.includes('may refer to:') ||
                                item.snippet.includes('disambiguation page')
        
        const isTooShort = item.snippet.length < 50
        
        return !isDisambiguation && !isTooShort
      })
      .sort((a: any, b: any) => b.relevance - a.relevance) // Sort by relevance
      .slice(0, 5) // Take top 5
      .map(({ title, pageid, snippet }: any) => ({ title, pageid, snippet }))

    return filteredResults
  } catch (error) {
    console.error('Error searching Wikipedia articles:', error)
    throw new Error('Failed to search Wikipedia articles')
  }
}

// Helper function to calculate relevance score
function calculateRelevance(query: string, title: string, snippet: string): number {
  const queryWords = query.toLowerCase().split(/\s+/)
  const titleWords = title.toLowerCase().split(/\s+/)
  const snippetWords = snippet.toLowerCase().split(/\s+/)
  
  let score = 0
  
  // Exact title match gets highest score
  if (title.toLowerCase().includes(query.toLowerCase())) {
    score += 100
  }
  
  // Word matches in title
  queryWords.forEach(word => {
    if (titleWords.includes(word)) score += 20
    if (title.toLowerCase().includes(word)) score += 10
  })
  
  // Word matches in snippet
  queryWords.forEach(word => {
    if (snippetWords.includes(word)) score += 5
    if (snippet.toLowerCase().includes(word)) score += 2
  })
  
  // Penalize very specific terms that might not be what we want
//   const specificTerms = ['telescope', 'satellite', 'mission', 'program', 'project']
//   specificTerms.forEach(term => {
//     if (title.toLowerCase().includes(term) && !query.toLowerCase().includes(term)) {
//       score -= 15
//     }
//   })
  
  return score
}

export async function fetchWikipediaSummary(topic: string): Promise<WikipediaSummary> {
  try {
    // First, search for relevant articles
    const searchResults = await searchWikipediaArticles(topic)
    
    if (searchResults.length === 0) {
      throw new Error('No Wikipedia articles found for this topic')
    }

    // Use the first (most relevant) result
    const bestMatch = searchResults[0]
    const encodedTitle = encodeURIComponent(bestMatch.title)
    
    // Fetch the summary for the best match
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NarrateAI/1.0 (https://narrateai.com; contact@narrateai.com)'
        }
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Wikipedia article not found')
      }
      throw new Error(`Wikipedia API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract the required fields
    const summary: WikipediaSummary = {
      title: data.title || bestMatch.title,
      summary: data.extract || bestMatch.snippet || 'No summary available.',
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodedTitle}`,
      thumbnail: data.thumbnail?.source || undefined
    }

    return summary

  } catch (error) {
    console.error('Error fetching Wikipedia summary:', error)
    
    if (error instanceof Error && error.message.includes('not found')) {
      throw new Error('Wikipedia article not found for this topic')
    }
    
    throw new Error('Failed to fetch Wikipedia summary')
  }
}

// New function to fetch multiple Wikipedia summaries
export async function fetchMultipleWikipediaSummaries(topic: string, count: number = 3): Promise<WikipediaSummary[]> {
  try {
    const searchResults = await searchWikipediaArticles(topic)
    
    if (searchResults.length === 0) {
      throw new Error('No Wikipedia articles found for this topic')
    }

    const summaries: WikipediaSummary[] = []
    
    // Fetch summaries for top results
    for (let i = 0; i < Math.min(count, searchResults.length); i++) {
      try {
        const result = searchResults[i]
        const encodedTitle = encodeURIComponent(result.title)
        
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'NarrateAI/1.0 (https://narrateai.com; contact@narrateai.com)'
            }
          }
        )

        if (response.ok) {
          const data = await response.json()
          
          summaries.push({
            title: data.title || result.title,
            summary: data.extract || result.snippet || 'No summary available.',
            url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodedTitle}`,
            thumbnail: data.thumbnail?.source || undefined
          })
        }
      } catch (error) {
        console.error(`Error fetching summary for ${searchResults[i].title}:`, error)
        // Continue with next result
      }
    }

    return summaries

  } catch (error) {
    console.error('Error fetching multiple Wikipedia summaries:', error)
    throw new Error('Failed to fetch Wikipedia summaries')
  }
}

// Helper function to clean topic for better Wikipedia search
export function cleanTopicForWikipedia(topic: string): string {
  return topic
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s/g, '_') // Replace spaces with underscores for Wikipedia URLs
} 