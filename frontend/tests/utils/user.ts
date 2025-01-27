import { type Page, expect } from "@playwright/test";

export async function logInUser(page: Page, email: string, password: string) {
  await page.goto("/login");

  await page.getByPlaceholder("email").fill(email);
  await page.getByPlaceholder("password", { exact: true }).fill(password);
  const logInButton = await page.locator(
    'button:has-text("Log In"):near(input[name="password"])',
  );
  await logInButton.click();
  await page.waitForURL("/");
  await expect(page.getByText("Welcome to SCANUE-V")).toBeVisible();
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

  await page.waitForURL("/");
}

export async function logOutUser(page: Page) {
  await page.goto("/logout");
}
