import { initialConfiguration } from "../mock/catalog";
import { resolveConfiguration } from "../engine/resolve";
import { bomAssembler } from "../engine/bomAssembler";
import type {
  Configuration,
  ConfiguredBom,
  FeatureId,
  FeatureValue,
  FeatureValues,
  MarketingConfiguration,
  WorkspacePage
} from "./types";

let state = {
  configuration: initialConfiguration(),
  page: "products" as WorkspacePage,
  generated: undefined as ConfiguredBom | undefined
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const update = (configuration: Configuration) => {
  state = {
    ...state,
    configuration: { ...configuration, revision: state.configuration.revision + 1 },
    generated: undefined
  };
  emit();
};
export const store = {
  getSnapshot: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setPage: (page: WorkspacePage) => {
    state = { ...state, page };
    emit();
  },
  template: (id: string) => update(initialConfiguration(id)),
  marketing: (patch: Partial<MarketingConfiguration>) => {
    // Explicit technical overrides survive marketing changes; conflicts remain visible.
    const marketing = { ...state.configuration.marketing, ...patch };
    if (patch.scenario === "CITY") {
      marketing.REAR_RACK = true;
      marketing.FENDER = true;
    }
    if (patch.scenario === "SPORT" || patch.scenario === "GRAVEL") marketing.REAR_RACK = false;
    update({ ...state.configuration, marketing, decisions: {} });
  },
  technical: (feature: FeatureId, value: FeatureValue) =>
    update({
      ...state.configuration,
      overrides: { ...state.configuration.overrides, [feature]: value },
      decisions: {}
    }),
  resetOverride: (feature?: FeatureId) => {
    const overrides = { ...state.configuration.overrides };
    if (feature) delete overrides[feature];
    update({ ...state.configuration, overrides: feature ? overrides : {}, decisions: {} });
  },
  applyFix: (patch: FeatureValues) =>
    update({
      ...state.configuration,
      overrides: { ...state.configuration.overrides, ...patch },
      decisions: {}
    }),
  decide: (specId: string, code: string) => {
    const match = resolveConfiguration(state.configuration).matches.find(
      (m) => m.specification.id === specId
    );
    if (!match?.candidates.some((m) => m.code === code)) return;
    update({
      ...state.configuration,
      decisions: { ...state.configuration.decisions, [specId]: code }
    });
  },
  generate: (warningsAccepted: boolean) => {
    const generated = bomAssembler(state.configuration, warningsAccepted);
    state = { ...state, generated };
    emit();
    return generated;
  }
};
