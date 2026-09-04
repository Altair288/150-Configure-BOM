import { describe, expect, it } from "vitest";
import { getConfiguratorData } from "@/features/configurator/api/configurator-api";

describe("configurator API boundary", () => {
  it("composes product, BOM, features and rules for the demo product", async () => {
    const data = await getConfiguratorData("vehicle-001");

    expect(data.product.number).toBe("VEH-1000");
    expect(data.bom.id).toBe("bom-vehicle-001");
    expect(data.features.map((feature) => feature.code)).toEqual([
      "ENGINE",
      "GEARBOX",
      "SEAT",
      "SEAT_COMFORT",
    ]);
    expect(data.rules).toHaveLength(3);
  });

  it("rejects unknown products before a page can render incomplete data", async () => {
    await expect(getConfiguratorData("unknown-product")).rejects.toThrow("was not found");
  });
});