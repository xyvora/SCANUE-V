import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Exact match to backend Topic model
interface BackendTopic {
  topic: string;
}

export async function POST(request: NextRequest) {
  let topicInput: unknown;
  try {
    // Parse request body
    const rawBody = await request.json();

    // Validate topic input
    topicInput = rawBody.topic;
    if (!topicInput || typeof topicInput !== 'string') {
      return NextResponse.json(
        { error: 'A valid topic string is required' },
        { status: 400 }
      );
    }

    // Prepare topic payload without sanitization
    const backendTopic: BackendTopic = {
      topic: topicInput
    };

    // Prepare backend request (ensure trailing slash matches FastAPI route)
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/v1/scan/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // TODO: Implement proper authentication as required
          // 'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(backendTopic)
      }
    );

    // Handle backend response dynamically
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

    // Parse dynamic backend response
    const responseData = await backendResponse.json();
    return NextResponse.json({
      ...responseData,
      timestamp: new Date().toISOString()
    });

  } catch (fetchError) {
    console.error('Scan API error:', fetchError);
    return NextResponse.json(
      {
        error: 'Failed to connect to backend service',
        details: fetchError instanceof Error ? fetchError.message : 'Unknown network error',
        originalTopic: typeof topicInput === 'string' ? topicInput : null,
        status:
          fetchError instanceof Error &&
          'status' in fetchError &&
          typeof (fetchError as { status?: number }).status === 'number'
            ? (fetchError as { status: number }).status
            : 503 // Service Unavailable
      },
      {
        status:
          fetchError instanceof Error &&
          'status' in fetchError &&
          typeof (fetchError as { status?: number }).status === 'number'
            ? (fetchError as { status: number }).status
            : 503
      }
    );
  }
}
