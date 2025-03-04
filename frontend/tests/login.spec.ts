import { type Page, expect, test } from "@playwright/test";
import { firstSuperuserEmail, firstSuperuserPassword } from "./config";
import { randomEmail, randomPassword } from "./utils/random";
import { createUser, logInUser } from "./utils/user";

test.use({ storageState: { cookies: [], origins: [] } });

const fillForm = async (page: Page, email: string, password: string) => {
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password", { exact: true }).fill(password);
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

test("Page redirects to / if not logged in", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL("/");
});

test("Inputs are visible, empty and editable", async ({ page }) => {
  await page.goto("/login");

  await verifyInput(page, "Email");
  await verifyInput(page, "Password", { exact: true });
});

test("Log In button is visible", async ({ page }) => {
  await page.goto("/login");

  await expect(
    page.locator('button:has-text("Log In"):near(input[name="password"])'),
  ).toBeVisible();
});

test("Log in with valid email and password", async ({ page }) => {
  await page.goto("/login");
  await fillForm(page, firstSuperuserEmail, firstSuperuserPassword);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL("/");

  await expect(page.getByText("Welcome to SCANUE-V")).toBeVisible();
});

test("Log out removes cookie", async ({ page, context }) => {
  const email = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);

  const cookies = await context.cookies();
  expect(cookies.some((cookie) => cookie.name === "access_token")).toBe(true);

  await page.goto("/logout");
  await page.waitForURL("/");

  const cookiesAfterLogout = await context.cookies();
  expect(
    cookiesAfterLogout.some((cookie) => cookie.name === "access_token"),
  ).toBe(false);
});

test("Email is required", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByPlaceholder("Email")).toHaveAttribute("required", "");
});

test("Password is required", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByPlaceholder("Password")).toHaveAttribute(
    "required",
    "",
  );
});
