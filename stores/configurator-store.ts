"use client";

import { create } from "zustand";
import type { Feature } from "@/types/feature";
import type { SelectedOptions } from "@/types/configuration";
import { defaultSelections } from "@/features/configurator/engine/configuration-engine";

interface ConfiguratorState {
  productId: string | null;
  selections: SelectedOptions;
  selectedBomItemId: string;
  dirty: boolean;
  initialize: (productId: string, features: Feature[]) => void;
  selectBomItem: (itemId: string) => void;
  setOption: (feature: Feature, optionCode: string, checked: boolean) => void;
  reset: (features: Feature[]) => void;
  markClean: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  productId: null,
  selections: {},
  selectedBomItemId: "bom-root",
  dirty: false,
  initialize: (productId, features) =>
    set((state) =>
      state.productId === productId
        ? state
        : {
            ...state,
            productId,
            selections: defaultSelections(features),
            selectedBomItemId: "bom-root",
            dirty: false,
          },
    ),
  selectBomItem: (selectedBomItemId) => set({ selectedBomItemId }),
  setOption: (feature, optionCode, checked) =>
    set((state) => {
      const current = state.selections[feature.id] ?? [];
      const next =
        feature.type === "SingleSelect"
          ? [optionCode]
          : checked
            ? [...new Set([...current, optionCode])]
            : current.filter((code) => code !== optionCode);

      return {
        selections: {
          ...state.selections,
          [feature.id]: next,
        },
        dirty: true,
      };
    }),
  reset: (features) => set({ selections: defaultSelections(features), dirty: true }),
  markClean: () => set({ dirty: false }),
}));