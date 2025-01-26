import { NextResponse, NextRequest } from "next/server";
import { apiUrl } from "@/config/api";
import type { UserUpdateMe } from "@/app/interfaces/users";

export async function GET(request: NextRequest) {
  const cookies = request.headers.get("cookie");
  const backendResponse = await fetch(`${apiUrl}/users/me`, {
    method: "GET",
    headers: { cookie: cookies || "" },
  });

  const responseJson = await backendResponse.json();
  if (!backendResponse.ok) {
    return new NextResponse(responseJson.message, {
      status: backendResponse.status,
    });
  }

  const response = new NextResponse(JSON.stringify(responseJson), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  return response;
}

export async function PATCH(request: NextRequest) {
  const cookies = request.headers.get("cookie");
  const body = (await request.json()) as UserUpdateMe;
  const backendResponse = await fetch(`${apiUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: cookies || "",
    },
    body: JSON.stringify(body),
  });

  const responseJson = await backendResponse.json();
  if (!backendResponse.ok) {
    return new NextResponse(responseJson.detail, {
      status: backendResponse.status,
    });
  }

  const response = new NextResponse(JSON.stringify(responseJson), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  return response;
}
