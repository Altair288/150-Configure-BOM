import type { ConfiguratorState } from "../model/types";
import RuleEngine, { type ConfigurationEvaluation } from "../domain/configurator/RuleEngine";

export default class ConfiguratorService {
  private static readonly ruleEngine = new RuleEngine();

  public static evaluate(
    input: Pick<ConfiguratorState, "engine" | "gearbox" | "seatMaterial">
  ): ConfigurationEvaluation {
    return this.ruleEngine.evaluate(input);
  }
}
