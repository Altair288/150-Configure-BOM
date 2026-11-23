import type { ConfigurationStore } from "../model/configuration";
import MockConfigurationApi from "../mock/mockConfigurationApi";

export type ConfigurationApiMessage =
  | { type: "example-data-fallback"; detail?: string }
  | { type: "migration-save-failed"; detail: string }
  | { type: "test-contexts-added"; count: number };

export interface ConfigurationApiLoadResult {
  store: ConfigurationStore;
  messages?: ConfigurationApiMessage[];
}

export interface ConfigurationApi {
  getConfigurationStore(): Promise<ConfigurationApiLoadResult>;
  saveConfigurationStore(store: ConfigurationStore): Promise<void>;
}

export function createConfigurationApi(): ConfigurationApi {
  return new MockConfigurationApi();
}
