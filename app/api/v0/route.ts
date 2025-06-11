import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createVercel } from '@ai-sdk/vercel'
import { z } from 'zod'

const requestSchema = z.object({ 
  prompt: z.string().min(5).max(1000) 
})

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // Validate request
    const body = await request.json()
    const { prompt } = requestSchema.parse(body)

    const apiKey = process.env.VERCEL_TOKEN
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Vercel API token not configured' }, { status: 500 })
    }

    const vercel = createVercel({ apiKey })

    // Use system message for better control
    const { text } = await generateText({
      model: vercel('v0-1.0-md'),
      messages: [
        {
          role: 'system',
          content: [
            'You are a code generator.',
            'Return exactly ONE React/TypeScript component named Component.',
            'Output plain text with NO markdown, no backticks.',
            'Use Tailwind CSS for styling.',
            'Do not fetch remote URLs or import anything except react.',
            'The component should be self-contained and production-ready.'
          ].join(' ')
        },
        { role: 'user', content: prompt }
      ],
    })

    // Clean up the response
    const cleanCode = text.trim()
      .replace(/```(?:typescript|tsx|javascript|jsx)?/g, '')
      .replace(/```/g, '')
      .trim()

    return NextResponse.json({
      code: cleanCode
    })
    
  } catch (error) {
    console.error('v0 API error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request: ' + error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate component' },
      { status: 500 }
    )
  }
}