"use client";

import { create } from "zustand";

interface BomState {
  selectedBomItemId: string;
  selectBomItem: (itemId: string) => void;
}

export const useBomStore = create<BomState>((set) => ({
  selectedBomItemId: "bom-root",
  selectBomItem: (selectedBomItemId) => set({ selectedBomItemId }),
}));