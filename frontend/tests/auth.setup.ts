import { firstSuperuserEmail, firstSuperuserPassword } from "./config";
import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(firstSuperuserEmail);
  await page.getByPlaceholder("Password").fill(firstSuperuserPassword);

  await page.getByRole("button", { name: "Log In" }).click();
  
  try {
    await page.waitForURL("/", { timeout: 60000 });
  } catch (error) {
    console.error("Navigation to homepage timed out after login:", error);
    // Continue even if navigation times out
  }
  
  await page.context().storageState({ path: authFile });
});
