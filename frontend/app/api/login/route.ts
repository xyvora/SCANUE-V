import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const username = body.get('username');
  const password = body.get('password');

  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/login/access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: username as string,
        password: password as string,
        grant_type: 'password', // Required by OAuth2PasswordRequestForm
      }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      // Handle specific backend error scenarios
      return NextResponse.json(
        { detail: data.detail || 'Login failed' }, 
        { status: backendResponse.status }
      );
    }

    // Successful login
    return NextResponse.json(data);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { detail: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 