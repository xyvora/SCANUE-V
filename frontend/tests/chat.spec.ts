import { createUser, logInUser } from "./utils/user";
import { expect, test } from "@playwright/test";
import { randomEmail, randomPassword } from "./utils/random";

test.use({ storageState: { cookies: [], origins: [] } });

test("Error message displayed when no chat message is entered", async ({
  page,
}) => {
  const email = randomEmail();
  const name = "Test User";
  const password = randomPassword();

  await createUser(page, email, name, password);
  await logInUser(page, email, password);

  await page.goto("/chat");

  const chatInput = await page.locator('input[name="txtChat"]');
  await expect(chatInput).toBeVisible();
  await expect(chatInput).toHaveValue("");

  const chatButton = await page.locator("#chatSubmit");
  await expect(chatButton).toBeVisible();
  await chatButton.click();
  await expect(page.getByText("Please enter a message")).toBeVisible();
});
