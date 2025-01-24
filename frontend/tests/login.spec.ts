import { type Page, expect, test } from "@playwright/test";
import { firstSuperuserEmail, firstSuperuserPassword } from "./config";
import { randomPassword } from "./utils/random";

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

test("Page redirects to /login if not logged in", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/.*login/);
});

test("Inputs are visible, empty and editable", async ({ page }) => {
  await page.goto("/login");

  await verifyInput(page, "email");
  await verifyInput(page, "password", { exact: true });
});

test("Log In button is visible", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
});

test("Log in with valid email and password ", async ({ page }) => {
  await page.goto("/login");
  await fillForm(page, firstSuperuserEmail, firstSuperuserPassword);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL("/");

  await expect(page.getByText("Welcome to SCANUE-V")).toBeVisible();
});
