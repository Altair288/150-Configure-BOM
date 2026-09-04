import type { ConfigurationRule } from "@/types/configuration";

export const configurationRules: ConfigurationRule[] = [
  {
    id: "rule-engine-20-gearbox",
    name: "2.0T gearbox compatibility",
    type: "Compatibility",
    condition: "ENGINE_20T",
    action: "Disable GEARBOX_7DCT",
  },
  {
    id: "rule-engine-20-exhaust",
    name: "2.0T exhaust auto-inclusion",
    type: "AutoInclude",
    condition: "ENGINE_20T",
    action: "Add Performance Exhaust",
  },
  {
    id: "rule-leather-comfort",
    name: "Leather seat comfort options",
    type: "Compatibility",
    condition: "SEAT_LEATHER",
    action: "Enable SEAT_HEATING and SEAT_VENTILATION",
  },
];