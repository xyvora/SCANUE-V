import { type Page, expect, test } from "@playwright/test";

test("Welcome is visible", async ({ page }) => {
  await page.goto("/");

  expect(await page.innerText("h1")).toBe("Welcome to SCANUE-V");
});
