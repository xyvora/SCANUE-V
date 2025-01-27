import { type Page, expect, test } from "@playwright/test";
import { randomEmail, randomPassword } from "./utils/random";
import { createUser, logInUser } from "./utils/user";

test.use({ storageState: { cookies: [], origins: [] } });

const fillForm = async (page: Page, email: string, password: string) => {
  await page.getByPlaceholder("email").fill(email);
  await page.getByPlaceholder("password", { exact: true }).fill(password);
};

const verifyInput = async (
  page: Page,
  placeholder: string,
  options?: OptionsType,
) => {
  const input = page.getByPlaceholder(placeholder, options);
  await expect(input).toBeVisible();
  await expect(input).toHaveText("");
  await expect(input).toBeEditable();
};

test("Navbar contains correct buttons when not logged in", async ({ page }) => {
  await page.goto("/login");

  const loginButton = page.getByRole("button", { name: "Log In" }).nth(0);
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  await expect(page).toHaveURL("/login");
});

test("Navbar contains correct buttons when logged in", async ({
  page,
  context,
}) => {
  const email = randomEmail();
  const updatedEmail = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);
  await page.goto("/chat");

  const profileButton = page.getByRole("button", { name: "Profile" });
  await expect(profileButton).toBeVisible();
  const logoutButton = page.getByRole("button", { name: "Log Out" });
  await expect(logoutButton).toBeVisible();

  await profileButton.click();
  await expect(page).toHaveURL("/account");

  await logoutButton.click();
  await expect(page).toHaveURL("/");

  const cookiesAfterLogout = await context.cookies();
  expect(
    cookiesAfterLogout.some((cookie) => cookie.name === "access_token"),
  ).toBe(false);
});
