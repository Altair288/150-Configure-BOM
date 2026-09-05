import type { ConfiguratorState } from "../../model/types";

export interface ConfigurationEvaluation {
  gearbox: string;
  enabledOptions: string[];
  result: string[];
}

export default class RuleEngine {
  public evaluate(
    input: Pick<ConfiguratorState, "engine" | "gearbox" | "seatMaterial">
  ): ConfigurationEvaluation {
    const enabledOptions = new Set<string>();
    const gearbox = input.engine === "2.0T" ? "8AT" : input.gearbox;

    if (input.engine === "2.0T") {
      enabledOptions.add("PERFORMANCE_EXHAUST");
    }

    if (input.seatMaterial === "Leather") {
      enabledOptions.add("SEAT_HEATING");
      enabledOptions.add("SEAT_VENTILATION");
    }

    return {
      gearbox,
      enabledOptions: Array.from(enabledOptions),
      result: [
        `${input.engine} Engine`,
        `${gearbox} Gearbox`,
        `${input.seatMaterial} Seat`,
        ...Array.from(enabledOptions).map((option) => option.replaceAll("_", " "))
      ]
    };
  }
}
