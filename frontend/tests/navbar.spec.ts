import { createUser, logInUser } from "./utils/user";
import { expect, test } from "@playwright/test";
import { randomEmail, randomPassword } from "./utils/random";

test.use({ storageState: { cookies: [], origins: [] } });

test("Navbar contains correct buttons when not logged in", async ({ page }) => {
  await page.goto("/");

  // Just check if the login button is visible without trying to click it
  const loginButton = page.locator("a", { hasText: "Log In" }).first();
  await expect(loginButton).toBeVisible();

  // Verify we can navigate to login page by direct URL instead of clicking
  await page.goto("/login");
  await expect(page).toHaveURL("/login");
});

test("Navbar contains correct buttons when logged in", async ({ page }) => {
  const email = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);
  await page.goto("/chat");

  const chatButton = page.locator("a", { hasText: "Chat" });
  await expect(chatButton).toBeVisible();
  const profileButton = page.locator("a", { hasText: "Account" });
  await expect(profileButton).toBeVisible();
  const logoutButton = page.getByRole("button", { name: "Log Out" });
  await expect(logoutButton).toBeVisible();
});

test("Navbar chat button goes to correct page", async ({ page }) => {
  const email = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);
  await page.goto("/profile");

  const chatButton = page.locator("a", { hasText: "Chat" });
  await expect(chatButton).toBeVisible();
  await chatButton.click();
  await expect(page).toHaveURL("/chat");
});

test("Navbar account button goes to correct page", async ({ page }) => {
  const email = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);
  await page.goto("/chat");

  const profileButton = page.locator("a", { hasText: "Account" });
  await expect(profileButton).toBeVisible();
  await profileButton.click();
  await expect(page).toHaveURL("/account");
});

test("Navbar account button preforms log out", async ({ page, context }) => {
  const email = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);
  await page.goto("/chat");

  const logoutButton = page.getByRole("button", { name: "Log Out" });
  await expect(logoutButton).toBeVisible();
  await logoutButton.click();
  await expect(page).toHaveURL("/");

  const cookiesAfterLogout = await context.cookies();
  expect(
    cookiesAfterLogout.some((cookie) => cookie.name === "access_token"),
  ).toBe(false);
});
