import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { topic } = await req.json()
  // Dummy data structure
  return NextResponse.json({
    script: `This is a dummy script for the topic: ${topic}.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.`,
    summary: `A brief summary about ${topic}.`,
    references: [
      {
        title: 'Reference Article 1',
        url: 'https://example.com/article1',
        description: 'A relevant article about the topic.'
      },
      {
        title: 'Reference Article 2',
        url: 'https://example.com/article2',
        description: 'Another source for further reading.'
      }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        alt: `${topic} illustration 1`,
        description: 'A relevant image for the topic.'
      },
      {
        url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        alt: `${topic} illustration 2`,
        description: 'Another visual suggestion.'
      }
    ]
  })
} 