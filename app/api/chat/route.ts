import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, GeminiRequest, GeminiResponse } from '@/lib/types';

// Gemini API endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GOOGLE_AI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Build conversation context from history
    const contents = [
      // Add system context for stock market assistance
      {
        role: 'user',
        parts: [{
          text: 'You are a helpful stock market assistant. Provide accurate, up-to-date information about stocks, markets, and financial news. Use web search to get the latest data when answering questions about current stock prices, market trends, or recent financial news.'
        }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I will help with stock market questions using real-time web search to provide accurate and current information.' }]
      },
      // Add conversation history (last 3-5 exchanges)
      ...history.slice(-5).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      // Add current message
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Prepare Gemini API request with Google Search enabled
    const geminiRequest: GeminiRequest = {
      contents,
      tools: [{
        googleSearchRetrieval: {
          dynamicRetrievalConfig: {
            mode: 'MODE_DYNAMIC',
            dynamicThreshold: 0.3
          }
        }
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    };

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(geminiRequest)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);

      return NextResponse.json(
        {
          error: errorData.error?.message || 'Failed to get response from AI service',
          details: errorData
        },
        { status: response.status }
      );
    }

    // Parse response
    const data: GeminiResponse = await response.json();

    // Extract text from response
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No response generated. Please try again.' },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json({
      response: aiResponse
    });

  } catch (error) {
    console.error('Chat API Error:', error);

    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
