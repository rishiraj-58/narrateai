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