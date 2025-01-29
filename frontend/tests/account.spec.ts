import { expect, test } from "@playwright/test";
import { firstSuperuser, firstSuperuserPassword } from "./config.ts";
import { randomEmail, randomPassword } from "./utils/random";
import { createUser, logInUser, logOutUser } from "./utils/user";

test.use({ storageState: { cookies: [], origins: [] } });

test("Correct buttons present when account page loads", async ({ page }) => {
  const email = randomEmail();
  const updatedEmail = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);

  await page.goto("/account");

  await expect(
    page.getByRole("button", { name: "Edit", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit Password" }),
  ).toBeVisible();
});

test("Inputs are visible and correct buttons present when Edit is clicked", async ({
  page,
}) => {
  const email = randomEmail();
  const updatedEmail = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);

  await page.goto("/account");
  const editButton = await page.getByRole("button", {
    name: "Edit",
    exact: true,
  });
  await expect(editButton).toBeVisible();
  await editButton.click();

  await expect(page.getByPlaceholder("Email")).toBeVisible();
  await expect(page.getByPlaceholder("Full Name")).toBeVisible();
  await expect(page.getByRole("button", { name: "Update" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
});

test("Update password navigates to correct page", async ({ page }) => {
  const email = randomEmail();
  const updatedEmail = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);

  await page.goto("/account");

  const editPasswordButton = await page.getByRole("button", {
    name: "Edit Password",
  });
  await expect(editPasswordButton).toBeVisible();
  await editPasswordButton.click();
  await expect(page).toHaveURL("/account/update-password");
});

test("Cancel resets values", async ({ page }) => {
  const email = randomEmail();
  const updatedEmail = randomEmail();
  const name = "Test User";
  const updatedName = "Test User 2";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);

  await page.goto("/account");
  const editButton = await page.getByRole("button", {
    name: "Edit",
    exact: true,
  });
  await expect(editButton).toBeVisible();
  await editButton.click();

  await page.getByPlaceholder("Email").fill(updatedEmail);
  await page.getByPlaceholder("Full Name").fill(updatedName);
  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(editButton).toBeVisible();
  await editButton.click();

  await expect(page.getByPlaceholder("Email")).toHaveValue(email);
  await expect(page.getByPlaceholder("Full Name")).toHaveValue(name);
});

test.describe("Edit user full name and email successfully", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Edit user name with a valid name", async ({ page }) => {
    const email = randomEmail();
    const name = "Test User";
    const updatedName = "Test User 2";
    const password = randomPassword();

    await createUser(page, email, name, password);
    await logInUser(page, email, password);

    await page.goto("/account");
    const editButton = await page.getByRole("button", {
      name: "Edit",
      exact: true,
    });
    await expect(editButton).toBeVisible();
    await editButton.click();

    await page.getByPlaceholder("Full Name").fill(updatedName);
    await page.getByRole("button", { name: "Update" }).click();

    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByPlaceholder("Full Name")).toHaveValue(updatedName);
  });

  test("Edit user email with a valid email", async ({ page }) => {
    const email = randomEmail();
    const updatedEmail = randomEmail();
    const name = "Test User";
    const password = randomPassword();

    await createUser(page, email, name, password);
    await logInUser(page, email, password);

    await page.goto("/account");
    const editButton = await page.getByRole("button", {
      name: "Edit",
      exact: true,
    });
    await expect(editButton).toBeVisible();
    await editButton.click();

    await page.getByPlaceholder("Email").fill(updatedEmail);
    await page.getByRole("button", { name: "Update" }).click();

    await expect(editButton).toBeVisible();
    await editButton.click();
    await expect(page.getByPlaceholder("Email")).toHaveValue(updatedEmail);
  });
});

test.describe("Change password successfully", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Update password successfully", async ({ page }) => {
    const email = randomEmail();
    const name = "Test User";
    const password = randomPassword();
    const NewPassword = randomPassword();

    await createUser(page, email, name, password);
    await logInUser(page, email, password);

    await page.goto("/account/update-password");
    await page.getByLabel("Current Password").fill(password);
    await page.getByLabel("New Password").fill(NewPassword);
    await page.getByLabel("Confirm Password").fill(NewPassword);
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByText("Password updated successfully")).toBeVisible();

    await logOutUser(page);

    // Check if the user can log in with the new password
    await logInUser(page, email, NewPassword);
  });
});

test.describe("Change password with invalid data", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Update password with weak passwords", async ({ page }) => {
    const email = randomEmail();
    const name = "Test User";
    const password = randomPassword();
    const weakPassword = "weak";

    await createUser(page, email, name, password);
    await logInUser(page, email, password);

    await page.goto("/account/update-password");
    await page.getByLabel("Current Password").fill(password);
    await page.getByLabel("New Password").fill(weakPassword);
    await page.getByLabel("Confirm Password").fill(weakPassword);
    await page.getByRole("button", { name: "Update" }).click();
    await expect(
      page.getByText("Update failed: String should have at least 8 characters"),
    ).toBeVisible();
  });

  test("New password and confirmation password do not match", async ({
    page,
  }) => {
    const email = randomEmail();
    const name = "Test User";
    const password = randomPassword();
    const newPassword = randomPassword();
    const confirmPassword = randomPassword();

    await createUser(page, email, name, password);
    await logInUser(page, email, password);

    await page.goto("/account/update-password");
    await page.getByLabel("Current Password").fill(password);
    await page.getByLabel("New Password").fill(newPassword);
    await page.getByLabel("Confirm Password").fill(confirmPassword);
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test("Current password and new password are the same", async ({ page }) => {
    const email = randomEmail();
    const name = "Test User";
    const password = randomPassword();

    await createUser(page, email, name, password);
    await logInUser(page, email, password);

    await page.goto("/account/update-password");
    await page.getByLabel("Current Password").fill(password);
    await page.getByLabel("New Password").fill(password);
    await page.getByLabel("Confirm Password").fill(password);
    await page.getByRole("button", { name: "Update" }).click();
    await expect(
      page.getByText(
        "Update failed: New password cannot be the same as the current one",
      ),
    ).toBeVisible();
  });
});
