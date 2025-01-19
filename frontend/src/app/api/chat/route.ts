export const runtime = "edge";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitize';

// Exact match to backend Topic model
interface BackendTopic {
  topic: string;
}

// Enhanced error logging
const logError = (message: string, error?: unknown) => {
  console.error(message, error instanceof Error ? error.message : error);
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const rawBody = await request.json();

    // Validate topic input
    const topicInput = rawBody.topic;
    if (!topicInput || typeof topicInput !== 'string') {
      logError('Invalid topic input', topicInput);
      return NextResponse.json(
        {
          error: 'A valid topic string is required',
          details: 'Topic must be a non-empty string'
        },
        { status: 400 }
      );
    }

    // Sanitize topic to match backend expectations
    const sanitizedTopic: BackendTopic = {
      topic: sanitizeInput(topicInput)
    };

    // Prepare backend request
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const backendEndpoint = `${backendUrl}/api/v1/scan`;

    try {
      const backendResponse = await fetch(backendEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Implement proper authentication
          // 'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(sanitizedTopic),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 seconds
      });

      // Handle backend response
      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        logError('Backend request failed', {
          status: backendResponse.status,
          details: errorData
        });

        return NextResponse.json(
          {
            error: errorData.detail || 'Failed to process scan request',
            status: backendResponse.status,
            originalTopic: topicInput
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
        timestamp: new Date().toISOString(),
        originalTopic: topicInput
      });

    } catch (fetchError) {
      logError('Backend fetch error', fetchError);

      return NextResponse.json(
        {
          error: 'Failed to connect to backend service',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown network error',
          originalTopic: topicInput,
          status: fetchError instanceof Error && 'status' in fetchError && typeof fetchError.status === 'number' 
            ? fetchError.status 
            : 503 // Service Unavailable
        },
        { 
          status: fetchError instanceof Error && 'status' in fetchError && typeof fetchError.status === 'number'
            ? fetchError.status 
            : 503 
        }
      );
    }

  } catch (error) {
    logError('Scan API error', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      },
      { status: 500 }
    );
  }
}
