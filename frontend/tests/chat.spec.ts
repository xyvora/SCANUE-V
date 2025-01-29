import { expect, test } from "@playwright/test";
import { firstSuperuser, firstSuperuserPassword } from "./config.ts";
import { randomEmail, randomPassword } from "./utils/random";
import { createUser, logInUser, logOutUser } from "./utils/user";

test("Error message displayed when not chat message is entered", async ({
  page,
}) => {
  const email = randomEmail();
  const updatedEmail = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);

  await page.goto("/chat");

  const chatInput = await page.getByPlaceholder("Message PFC agent...");
  await expect(chatInput).toBeVisible();
  await expect(chatInput).toHaveValue("");

  const chatButton = await page.locator("#chatSubmit");
  await expect(chatButton).toBeVisible();
  await chatButton.click();
  await expect(page.getByText("Please enter a message")).toBeVisible();
});
