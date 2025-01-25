import { expect, test } from "@playwright/test";
import { firstSuperuser, firstSuperuserPassword } from "./config.ts";
import { randomEmail, randomPassword } from "./utils/random";
import { createUser, logInUser, logOutUser } from "./utils/user";

test.describe("Edit user full name and email successfully", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Edit user name with a valid name", async ({ page }) => {
    const email = randomEmail();
    const name = "Test User";
    const updatedName = "Test User 2";
    const password = randomPassword();

    await createUser(page, email, name, password);

    // Log in the user
    await logInUser(page, email, password);

    await page.goto("/account");
    await page.getByPlaceholder("Full Name").fill(updatedName);
    await page.getByRole("button", { name: "Update" }).click();
    await page.reload();
    await expect(page.getByPlaceholder("Full Name")).toHaveValue(updatedName);
  });

  test("Edit user email with a valid email", async ({ page }) => {
    const email = randomEmail();
    const updatedEmail = randomEmail();
    const name = "Test User";
    const password = randomPassword();

    await createUser(page, email, name, password);

    // Log in the user
    await logInUser(page, email, password);

    await page.goto("/account");
    await page.getByPlaceholder("Email").fill(updatedEmail);
    await page.getByRole("button", { name: "Update" }).click();
    await page.reload();
    await expect(page.getByPlaceholder("Email")).toHaveValue(updatedEmail);
  });
});
