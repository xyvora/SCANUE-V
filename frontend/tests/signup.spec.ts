import { type Page, expect, test } from "@playwright/test";

import { randomEmail, randomPassword } from "./utils/random";

test.use({ storageState: { cookies: [], origins: [] } });

type OptionsType = {
  exact?: boolean;
};

const fillForm = async (
  page: Page,
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  await page.getByPlaceholder("Full Name").fill(fullName);
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password", { exact: true }).fill(password);
  await page.getByPlaceholder("Confirm Password").fill(confirmPassword);
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

test("Inputs are visible, empty and editable", async ({ page }) => {
  await page.goto("/signup");

  await verifyInput(page, "Full Name");
  await verifyInput(page, "Email");
  await verifyInput(page, "Password", { exact: true });
  await verifyInput(page, "Confirm Password");
});

test("Sign Up button is visible", async ({ page }) => {
  await page.goto("/signup");

  await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
});

test("Sign up with valid name, email, and password", async ({ page }) => {
  const fullName = "Test User";
  const email = randomEmail();
  const password = randomPassword();

  await page.goto("/signup");
  await fillForm(page, fullName, email, password, password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  await page.waitForURL("/login");

  await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
});

test("Sign up with existing email", async ({ page }) => {
  const fullName = "Test User";
  const email = randomEmail();
  const password = randomPassword();

  // Sign up with an email
  await page.goto("/signup");

  await fillForm(page, fullName, email, password, password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // Sign up again with the same email
  await page.goto("/signup");

  await fillForm(page, fullName, email, password, password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // TODO: update this to check for error message once it is added
  await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
});

test("Sign up with weak password", async ({ page }) => {
  const fullName = "Test User";
  const email = randomEmail();
  const password = "weak";

  await page.goto("/signup");

  await fillForm(page, fullName, email, password, password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // TODO: update this to check for error message once it is added
  await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
});

test("Sign up with mismatched passwords", async ({ page }) => {
  const fullName = "Test User";
  const email = randomEmail();
  const password = randomPassword();
  const password2 = randomPassword();

  await page.goto("/signup");

  await fillForm(page, fullName, email, password, password2);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // TODO: update this to check for error message once it is added
  await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
});

test("Sign up with missing full name", async ({ page }) => {
  const fullName = "";
  const email = randomEmail();
  const password = randomPassword();

  await page.goto("/signup");

  await fillForm(page, fullName, email, password, password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // TODO: update this to check for error message once it is added
  await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
});

test("Sign up with missing email", async ({ page }) => {
  const fullName = "Test User";
  const email = "";
  const password = randomPassword();

  await page.goto("/signup");

  await fillForm(page, fullName, email, password, password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // TODO: update this to check for error message once it is added
  await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
});

test("Sign up with missing password", async ({ page }) => {
  const fullName = "";
  const email = randomEmail();
  const password = "";

  await page.goto("/signup");

  await fillForm(page, fullName, email, password, password);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // TODO: update this to check for error message once it is added
  await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
});
