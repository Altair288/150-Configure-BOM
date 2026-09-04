import type { BomItem } from "@/types/bom";
import type { Feature } from "@/types/feature";
import type {
  ConfigurationResult,
  DisabledOptions,
  ResolvedRule,
  SelectedOptions,
} from "@/types/configuration";

const hasSelection = (features: Feature[], selections: SelectedOptions, condition: string) => {
  if (selections[condition]?.length) {
    return true;
  }

  if (Object.values(selections).some((optionCodes) => optionCodes.includes(condition))) {
    return true;
  }

  const feature = features.find((candidate) => candidate.code === condition);
  return Boolean(feature && selections[feature.id]?.length);
};

const resolveSelectedItem = (
  features: Feature[],
  selections: SelectedOptions,
  bomItem: BomItem,
): BomItem => {
  const feature = features.find((candidate) => candidate.code === bomItem.selectionCondition);
  const selectedOptionCode = feature ? selections[feature.id]?.[0] : undefined;
  const selectedOption = feature?.options.find((option) => option.code === selectedOptionCode);

  if (!selectedOption) {
    return bomItem;
  }

  const name = bomItem.name === "Seat" ? `${selectedOption.name} Seat` : `${bomItem.name} ${selectedOption.name}`;

  return {
    ...bomItem,
    materialId: selectedOption.id,
    materialNumber: selectedOption.materialNumber,
    name,
  };
};

const cloneItem = (bomItem: BomItem, children: BomItem[] = bomItem.children): BomItem => ({
  ...bomItem,
  children,
});

const applySelectionsToBom = (
  features: Feature[],
  bomItem: BomItem,
  selections: SelectedOptions,
  disabledOptions: DisabledOptions,
): BomItem => {
  const children = bomItem.children
    .filter((child) => {
      if (!child.selectionCondition) {
        return true;
      }

      const disabled = Object.values(disabledOptions).some((optionCodes) =>
        optionCodes.includes(child.selectionCondition ?? ""),
      );

      return !disabled && hasSelection(features, selections, child.selectionCondition);
    })
    .map((child) =>
      applySelectionsToBom(features, resolveSelectedItem(features, selections, child), selections, disabledOptions),
    );

  return cloneItem(bomItem, children);
};

export const defaultSelections = (features: Feature[]): SelectedOptions => {
  const selections: SelectedOptions = {};

  features.forEach((feature) => {
    if (feature.required && feature.options[0]) {
      selections[feature.id] = [feature.options[0].code];
    } else {
      selections[feature.id] = [];
    }
  });

  return selections;
};

export const resolveConfiguration = (
  features: Feature[],
  bomRoot: BomItem,
  selections: SelectedOptions,
): ConfigurationResult => {
  const effectiveSelections: SelectedOptions = Object.fromEntries(
    Object.entries(selections).map(([featureId, optionCodes]) => [featureId, [...optionCodes]]),
  );
  const engineSelection = effectiveSelections["feature-engine"]?.[0];
  const seatSelection = effectiveSelections["feature-seat"]?.[0];
  const disabledOptions: DisabledOptions = {};
  const resolvedRules: ResolvedRule[] = [];
  const warnings: string[] = [];

  if (engineSelection === "ENGINE_20T") {
    disabledOptions["feature-gearbox"] = ["GEARBOX_7DCT"];
    if (effectiveSelections["feature-gearbox"]?.[0] === "GEARBOX_7DCT") {
      effectiveSelections["feature-gearbox"] = ["GEARBOX_8AT"];
    }
    resolvedRules.push({
      id: "rule-engine-20-gearbox",
      name: "2.0T gearbox compatibility",
      type: "Compatibility",
      result: "Applied",
      detail: "7DCT disabled; 8AT remains available",
    });
    resolvedRules.push({
      id: "rule-engine-20-exhaust",
      name: "2.0T exhaust auto-inclusion",
      type: "AutoInclude",
      result: "Applied",
      detail: "Performance Exhaust added to the final BOM",
    });
  } else {
    resolvedRules.push({
      id: "rule-engine-20-gearbox",
      name: "2.0T gearbox compatibility",
      type: "Compatibility",
      result: "Skipped",
      detail: "Rule is inactive for the selected engine",
    });
  }

  if (seatSelection === "SEAT_LEATHER") {
    resolvedRules.push({
      id: "rule-leather-comfort",
      name: "Leather seat comfort options",
      type: "Compatibility",
      result: "Applied",
      detail: "Seat Heating and Seat Ventilation are available",
    });
  } else {
    disabledOptions["feature-seat-comfort"] = ["SEAT_HEATING", "SEAT_VENTILATION"];
    if (effectiveSelections["feature-seat-comfort"]?.length) {
      warnings.push("Seat comfort options were cleared because Fabric seats do not support them.");
    }
    effectiveSelections["feature-seat-comfort"] = [];
    resolvedRules.push({
      id: "rule-fabric-comfort",
      name: "Fabric seat comfort options",
      type: "Compatibility",
      result: "Applied",
      detail: "Seat Heating and Seat Ventilation are disabled",
    });
  }

  return {
    selectedOptions: effectiveSelections,
    disabledOptions,
    resolvedRules,
    warnings,
    generatedBom: applySelectionsToBom(features, bomRoot, effectiveSelections, disabledOptions),
  };
};