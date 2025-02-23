import { NextResponse } from "next/server";
import isLoggedIn from "@/utils/auth";

export async function GET() {
  const loggedIn = await isLoggedIn();

  return NextResponse.json({ loggedIn: !!loggedIn });
}
