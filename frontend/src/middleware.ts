import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all pages except:
     * 1. /api/* (exclude all API routes)
     * 2. /_next/* (exclude Next.js assets, e.g., /_next/static/*)
     * 3. / (exclude home page)
     * 4. /login (exclude the login page)
     * 5. /signup (exclude the signup page)
     */
    "/((?!api|_next/static|_next/image|$|login|signup).*)",
  ],
};
