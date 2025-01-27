import { test as setup } from "@playwright/test";
import { firstSuperuserEmail, firstSuperuserPassword } from "./config";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(firstSuperuserEmail);
  await page.getByPlaceholder("Password").fill(firstSuperuserPassword);
  await page.getByRole("button", { name: "Log In" }).nth(1).click();
  await page.waitForURL("/");
  await page.context().storageState({ path: authFile });
});
