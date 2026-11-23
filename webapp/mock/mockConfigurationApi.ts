import {
  normalizeFeatureModelStore,
  resolveDefinition,
  validateStore
} from "../model/configuration";
import type { ConfigurationStore } from "../model/configuration";
import type { ConfigurationApi, ConfigurationApiLoadResult } from "../service/configurationApi";
import {
  createSeed,
  ensureChineseSUVMockData,
  ensureConstraintSampleFeatures,
  ensureLoadTestContexts
} from "./configurationMockData";

interface ConfigurationStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = "plm.configuration-vocabulary.v2";

export default class MockConfigurationApi implements ConfigurationApi {
  private readonly storage?: ConfigurationStorage;
  private readonly storageFailure?: unknown;

  public constructor(storage?: ConfigurationStorage) {
    if (storage) {
      this.storage = storage;
      return;
    }
    try {
      this.storage = globalThis.localStorage;
    } catch (error) {
      this.storageFailure = error;
    }
  }

  public async getConfigurationStore(): Promise<ConfigurationApiLoadResult> {
    const helpers = { validateStore, resolveDefinition };
    const exampleStore = ensureConstraintSampleFeatures(createSeed(helpers), helpers);
    if (!this.storage)
      return {
        store: exampleStore,
        messages: [
          {
            type: "example-data-fallback",
            ...(this.storageFailure ? { detail: String(this.storageFailure) } : {})
          }
        ]
      };

    let saved: string | null;
    try {
      saved = this.storage.getItem(STORAGE_KEY);
    } catch (error) {
      return {
        store: exampleStore,
        messages: [
          {
            type: "example-data-fallback",
            detail: error instanceof Error ? error.message : String(error)
          }
        ]
      };
    }
    if (!saved) return { store: exampleStore };

    let store: ConfigurationStore;
    let addedTestContexts = 0;
    try {
      const parsed = normalizeFeatureModelStore(JSON.parse(saved));
      const errors = validateStore(parsed);
      if (errors.length) throw new Error(errors.slice(0, 12).join("\n"));
      const featureCompleteStore = ensureChineseSUVMockData(parsed, helpers);
      const constraintCompleteStore = ensureConstraintSampleFeatures(featureCompleteStore, helpers);
      const beforeLoadTestData = constraintCompleteStore.contexts.length;
      store = ensureLoadTestContexts(constraintCompleteStore, helpers);
      addedTestContexts = store.contexts.length - beforeLoadTestData;
    } catch (error) {
      return {
        store: exampleStore,
        messages: [
          {
            type: "example-data-fallback",
            detail: error instanceof Error ? error.message : String(error)
          }
        ]
      };
    }

    const messages = [];
    try {
      await this.saveConfigurationStore(store);
    } catch (error) {
      messages.push({
        type: "migration-save-failed" as const,
        detail: error instanceof Error ? error.message : String(error)
      });
    }
    if (addedTestContexts > 0)
      messages.push({
        type: "test-contexts-added" as const,
        count: store.contexts.length
      });
    return { store, ...(messages.length ? { messages } : {}) };
  }

  public async saveConfigurationStore(store: ConfigurationStore): Promise<void> {
    if (!this.storage) {
      const detail = this.storageFailure ? `：${String(this.storageFailure)}` : "";
      throw new Error(`当前环境无法访问浏览器本地存储，配置数据未保存${detail}`);
    }
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      throw new Error(
        `保存配置数据失败：${error instanceof Error ? error.message : String(error)}`,
        { cause: error }
      );
    }
  }
}
