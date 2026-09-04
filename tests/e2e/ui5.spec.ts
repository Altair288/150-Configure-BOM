import { expect, test } from "@playwright/test";

test("renders the UI5 enterprise shell and common form controls", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.locator(".shell-header")).toBeVisible();
  await expect(page.locator("ui5-shellbar")).toHaveAttribute("primary-title", "Super BOM Configurator");
  await expect(page.locator(".shell-navigation")).toBeVisible();
  await expect(page.locator('[role="toolbar"]').first()).toBeVisible();
  await expect(page.getByText("Product portfolio")).toBeVisible({ timeout: 15_000 });
  const searchInput = page.getByTestId("product-search-input");
  const statusFilter = page.getByTestId("product-status-filter");
  await expect(searchInput).toBeVisible({ timeout: 15_000 });
  await expect(statusFilter).toBeVisible({ timeout: 15_000 });

  await searchInput.click();
  await page.keyboard.type("Sport");
  await expect(page.getByText("Urban Motion X Sport")).toBeVisible();
  await expect(page.getByText("Urban Motion X", { exact: true })).toHaveCount(0);

  await statusFilter.click();
  await page.locator('ui5-option[value="Released"]').click();
  await expect(page.getByText("Urban Motion X Sport")).toHaveCount(0);

  await page.goto("/products");
  await expect(page.locator("ui5-dynamic-page")).toBeVisible();
  await expect(page.locator("ui5-dynamic-page").getByRole("heading", { name: "Products" })).toBeVisible();

  await page.goto("/rules");
  await expect(page.locator("ui5-toolbar")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create rule" })).toBeVisible({ timeout: 20_000 });
});

test("toggles the UI5 Switch and opens the publish Dialog", async ({ page }) => {
  await page.goto("/configurator/vehicle-001");

  const liveRules = page.locator("ui5-switch");
  await expect(liveRules).toHaveJSProperty("checked", true);
  await liveRules.click();
  await expect(liveRules).toHaveJSProperty("checked", false);

  await page.getByTestId("publish-configuration").click();
  await expect(page.getByRole("dialog", { name: "Publish configuration variant" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("dialog", { name: "Publish configuration variant" })).toBeHidden();
});