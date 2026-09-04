import { describe, expect, it } from "vitest";
import { demoBom } from "@/mocks/bom";
import { demoFeatures } from "@/mocks/feature";
import {
  defaultSelections,
  resolveConfiguration,
} from "@/features/configurator/engine/configuration-engine";

describe("configuration engine", () => {
  it("disables 7DCT and includes performance exhaust for a 2.0T configuration", () => {
    const selections = defaultSelections(demoFeatures);
    selections["feature-engine"] = ["ENGINE_20T"];

    const result = resolveConfiguration(demoFeatures, demoBom.rootItem, selections);

    expect(result.disabledOptions["feature-gearbox"]).toContain("GEARBOX_7DCT");
    expect(result.selectedOptions["feature-gearbox"]).toEqual(["GEARBOX_8AT"]);
    expect(result.generatedBom.children[0]?.children.map((child) => child.name)).toContain(
      "Performance Exhaust",
    );
    expect(result.resolvedRules.every((rule) => rule.result === "Applied" || rule.result === "Skipped")).toBe(
      true,
    );
  });

  it("unlocks comfort options for leather seats and keeps them in the generated BOM", () => {
    const selections = defaultSelections(demoFeatures);
    selections["feature-seat"] = ["SEAT_LEATHER"];
    selections["feature-seat-comfort"] = ["SEAT_HEATING", "SEAT_VENTILATION"];

    const result = resolveConfiguration(demoFeatures, demoBom.rootItem, selections);
    const interior = result.generatedBom.children.find((child) => child.name === "Interior");

    expect(result.disabledOptions["feature-seat-comfort"]).toBeUndefined();
    expect(interior?.children.map((child) => child.name)).toEqual([
      "Leather Seat",
      "Seat Heating",
      "Seat Ventilation",
    ]);
  });
});