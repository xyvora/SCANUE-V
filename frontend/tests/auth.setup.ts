import { test as setup } from "@playwright/test";
import { firstSuperuserEmail, firstSuperuserPassword } from "./config";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(firstSuperuserEmail);
  await page.getByPlaceholder("Password").fill(firstSuperuserPassword);
  await page.getByRole("button", { name: "Log In" }).click();
  console.log("Clicked login button, waiting for navigation...");
  // await page.waitForURL("/");
  try {
    await page.waitForURL("/", { timeout: 30000 });
  } catch (error) {
    console.error("Navigation to '/' failed:", error);
    const body = await page.content();
    console.error("Page content:", body);
  }
  await page.context().storageState({ path: authFile });
});
