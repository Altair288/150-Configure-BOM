import { expect, test } from "@playwright/test";

test("loads the workspace and navigates to the Super BOM explorer", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Dashboard \| Super BOM Configurator/);
  await expect(page.getByRole("main").getByRole("heading", { name: "Super BOM Configurator" })).toBeVisible();
  await expect(page.getByText("Active products")).toBeVisible();

  await page.getByRole("link", { name: "Open Super BOM" }).click();
  await expect(page).toHaveURL(/\/bom\/bom-vehicle-001$/);
  await expect(page.getByRole("heading", { name: "BOM Structure" })).toBeVisible();
  await expect(page.getByText("Urban Motion X Super BOM")).toBeVisible();
});