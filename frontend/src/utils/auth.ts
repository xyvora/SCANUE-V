import { cookies } from "next/headers";

export default async function isLoggedIn() {
  const cookieInstance = await cookies();
  const token = cookieInstance.get("access_token");

  return token !== undefined && token !== null;
}
