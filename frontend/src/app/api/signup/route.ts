import { NextRequest, NextResponse } from "next/server";
import type { UserCreate } from "@/app/interfaces/users";
import { apiUrl } from "@/config/api";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as UserCreate;

  const backendResponse = await fetch(`${apiUrl}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseJson = await backendResponse.json();
  if (!backendResponse.ok) {
    return new NextResponse(responseJson.message, {
      status: backendResponse.status,
    });
  }

  const response = new NextResponse(
    JSON.stringify({ message: "Signup successful" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );

  return response;
}
