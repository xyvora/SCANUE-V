export async function isLoggedIn() {
  try {
    const response = await fetch("/api/auth/check", {
      method: "GET",
      credentials: "include",
    });
    return response.ok;
  } catch (_error) {
    return false;
  }
}
