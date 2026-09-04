import { expect, test } from "@playwright/test";

test("selects a BOM node and shows its properties", async ({ page }) => {
  await page.goto("/bom/bom-vehicle-001");

  await expect(page.getByText("Vehicle").first()).toBeVisible();
  await page.getByText("Engine").first().click();

  await expect(page.getByRole("heading", { name: "Engine" })).toBeVisible();
  await expect(page.getByText("engine-family", { exact: true })).toBeVisible();
  await expect(page.getByText("Optional").first()).toBeVisible();

  await page.getByRole("button", { name: "Tree only" }).click();
  await expect(page.getByText("Tree-only view")).toBeVisible();
});