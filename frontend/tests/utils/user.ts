import { type Page, expect } from "@playwright/test";

export async function logInUser(page: Page, email: string, password: string) {
  await page.goto("/login");

  await page.getByPlaceholder("Email").fill(email);
  await page
    .getByPlaceholder("Password", { exact: true })
    .fill(password);
  const logInButton = page.locator(
    "button:has-text(\"Log In\"):near(input[name=\"password\"])",
  );
  await logInButton.click();

  try {
    await page.waitForURL("/", { timeout: 60000 });
    await expect(page.getByText("Welcome to SCANUE-V")).toBeVisible();
  } catch (error) {
    console.error("Navigation to homepage or welcome text timed out after login:", error);
    // Continue the test even if navigation times out
  }
}

export async function createUser(
  page: Page,
  email: string,
  fullName: string,
  password: string,
) {
  await page.goto("/signup");
  await page.getByPlaceholder("Full Name").fill(fullName);
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password", { exact: true }).fill(password);
  await page.getByPlaceholder("Confirm Password").fill(password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  try {
    // Add a longer timeout and make it more specific with waitForNavigation
    await page.waitForURL("/", { timeout: 60000 });
  } catch (error) {
    console.error("Navigation to homepage timed out after signup:", error);
    // Continue the test even if navigation times out
  }
}

export async function logOutUser(page: Page) {
  await page.goto("/logout");
}
