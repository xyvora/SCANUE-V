import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const url = new URL("/", request.nextUrl.origin);
  const response = NextResponse.redirect(url);
  response.cookies.set("access_token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
    path: "/",
  });

  return response;
}
