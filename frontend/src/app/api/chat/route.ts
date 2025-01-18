export const runtime = "edge";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitize';

// Exact match to backend Topic model
interface BackendTopic {
  topic: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const rawBody = await request.json();

    // Validate topic input
    const topicInput = rawBody.topic;
    if (!topicInput || typeof topicInput !== 'string') {
      return NextResponse.json(
        { error: 'A valid topic string is required' },
        { status: 400 }
      );
    }

    // Sanitize topic to match backend expectations
    const sanitizedTopic: BackendTopic = {
      topic: sanitizeInput(topicInput)
    };

    // Prepare backend request
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/v1/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Implement proper authentication
        // 'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(sanitizedTopic)
    });

    // Handle backend response
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { 
          error: errorData.detail || 'Failed to process scan request',
          status: backendResponse.status
        },
        { status: backendResponse.status }
      );
    }

    // Parse backend response
    const responseData = await backendResponse.json();
    
    return NextResponse.json({
      // Map backend AgentState fields
      response: responseData.response || 'No response received',
      stage: responseData.stage,
      subtasks: responseData.subtasks,
      feedback: responseData.feedback,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scan API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        status: 500
      },
      { status: 500 }
    );
  }
}
