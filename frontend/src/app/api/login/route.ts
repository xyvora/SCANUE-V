import { NextResponse, NextRequest } from "next/server";
import { apiUrl } from "@/config/api";

export async function POST(request: NextRequest) {
  const text = await request.text();
  const params = new URLSearchParams(text);
  const username = params.get("username");
  const password = params.get("password");

  if (!username || !password) {
    return new NextResponse("Email and password are required", { status: 400 });
  }

  const backendResponse = await fetch(`${apiUrl}/login/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
  });

  const responseJson = await backendResponse.json();
  if (!backendResponse.ok) {
    return new NextResponse(responseJson.message, {
      status: backendResponse.status,
    });
  }

  const setCookie = backendResponse.headers.get("set-cookie");
  const response = new NextResponse(
    JSON.stringify({ message: "Login successful" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );

  if (setCookie) {
    response.headers.append("Set-Cookie", setCookie);
  }

  return response;
}
