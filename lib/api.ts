export async function generateContent(topic: string) {
  // Call the mock API route
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  })
  if (!res.ok) throw new Error('Failed to fetch generated content')
  return res.json()
}

export async function searchVideos(topic: string, maxResults: number = 5) {
  const res = await fetch(`/api/videos?topic=${encodeURIComponent(topic)}&maxResults=${maxResults}`)
  if (!res.ok) throw new Error('Failed to fetch videos')
  return res.json()
}

export async function fetchWikipediaSummary(topic: string) {
  const res = await fetch(`/api/wikipedia?topic=${encodeURIComponent(topic)}`)
  if (!res.ok) throw new Error('Failed to fetch Wikipedia summary')
  return res.json()
}

export async function searchWikipediaArticles(topic: string) {
  const res = await fetch('/api/wikipedia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  })
  if (!res.ok) throw new Error('Failed to search Wikipedia articles')
  return res.json()
} 