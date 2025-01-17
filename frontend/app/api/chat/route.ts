export const runtime = "edge";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitize';

// Move VALID_AGENTS inside the file or import it from a separate constants file
const VALID_AGENTS = ['General', 'PFC'] as const;
export const revalidate = 0;

// Define a type for the request body
interface ChatRequestBody {
  message: string;
  agent: string;
}

export async function POST(request: NextRequest) {
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { message, agent } = body;

  // Validate input types
  if (typeof message !== "string" || typeof agent !== "string") {
    return NextResponse.json({ error: "Invalid field types" }, { status: 400 });
  }

  // Sanitize inputs
  const sanitizedMessage = sanitizeInput(message);

  // Check for missing fields
  if (!message || !agent) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate message length
  if (sanitizedMessage.length === 0) {
    return NextResponse.json({ error: "Invalid message format or length" }, { status: 400 });
  }

  // Validate message length
  if (message.length > 1000) {
    return NextResponse.json({ error: 'Message exceeds maximum length' }, { status: 400 });
  }

  // Validate agent type
  if (!VALID_AGENTS.includes(agent as typeof VALID_AGENTS[number])) {
    return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: sanitizedMessage, agent }),
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to process chat request' }, 
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Chat processing error:', error);
    return NextResponse.json(
      { error: `Failed to process request: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
