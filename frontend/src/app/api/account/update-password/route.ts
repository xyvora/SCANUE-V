import { NextResponse, NextRequest } from "next/server";
import { apiUrl } from "@/config/api";
import type { UpdatePassword } from "@/app/interfaces/users";

export async function PATCH(request: NextRequest) {
  const cookies = request.headers.get("cookie");
  const body = (await request.json()) as UpdatePassword;
  const backendResponse = await fetch(`${apiUrl}/users/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: cookies || "",
    },
    body: JSON.stringify(body),
  });

  const responseJson = await backendResponse.json();
  if (!backendResponse.ok) {
    if (
      typeof responseJson.detail === "string" ||
      responseJson.detail instanceof String
    ) {
      return new NextResponse(responseJson.detail, {
        status: backendResponse.status,
      });
    } else {
      return new NextResponse(responseJson.detail[0].msg, {
        status: backendResponse.status,
      });
    }
  }

  const response = new NextResponse(JSON.stringify(responseJson), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  return response;
}
