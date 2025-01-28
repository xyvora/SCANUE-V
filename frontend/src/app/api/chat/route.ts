import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiUrl } from "@/config/api";

export async function POST(request: NextRequest) {
  const cookies = request.headers.get("cookie");
  let topic: string | undefined;

  try {
    const rawBody = await request.json();

    topic = rawBody.topic;
    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "A valid topic string is required" },
        { status: 422 },
      );
    }

    const backendResponse = await fetch(`${apiUrl}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      body: JSON.stringify({ topic }),
    });

    const responseJson = await backendResponse.json();
    if (!backendResponse.ok) {
      return new NextResponse(responseJson.message, {
        status: backendResponse.status,
      });
    }

    return new NextResponse(JSON.stringify(responseJson), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (fetchError) {
    return NextResponse.json(
      {
        error: "Failed to connect to backend service",
        details:
          fetchError instanceof Error
            ? fetchError.message
            : "Unknown network error",
        topic,
      },
      { status: 503 },
    );
  }
}
