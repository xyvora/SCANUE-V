import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies(); // Await the promise to get the cookie store
  const accessToken = cookieStore.get("access_token");
  
  if (!accessToken) {
    return new NextResponse(null, { status: 401 });
  }

  return new NextResponse(null, { status: 200 });
} 