import { expect, test } from "@playwright/test";

test("resolves engine and leather seat configuration into a final BOM", async ({ page }) => {
  await page.goto("/configurator/vehicle-001");

  await expect(page.getByRole("heading", { name: "Urban Motion X / Super BOM" })).toBeVisible();

  await page.getByTestId("option-ENGINE_20T").click();
  await expect(page.getByTestId("option-GEARBOX_7DCT")).toHaveAttribute("disabled", "");
  await expect(page.getByTestId("option-GEARBOX_8AT")).toHaveJSProperty("checked", true);
  await expect(page.getByTestId("configuration-result")).toContainText("Performance Exhaust");

  await page.getByTestId("option-SEAT_LEATHER").click();
  await expect(page.getByTestId("option-SEAT_HEATING")).toBeEnabled();
  await expect(page.getByTestId("option-SEAT_VENTILATION")).toBeEnabled();
  await page.getByTestId("option-SEAT_HEATING").click();
  await page.getByTestId("option-SEAT_VENTILATION").click();

  await expect(page.getByTestId("configuration-result")).toContainText("Leather Seat");
  await expect(page.getByTestId("configuration-result")).toContainText("Seat Heating");
  await expect(page.getByTestId("configuration-result")).toContainText("Seat Ventilation");

  await page.getByTestId("publish-configuration").click();
  await expect(page.getByRole("dialog", { name: "Publish configuration variant" })).toBeVisible();
  await page.getByRole("button", { name: "Publish variant" }).last().click();
  await expect(page.getByTestId("publish-configuration")).toContainText("Published");
});