"use client";

import { create } from "zustand";

interface AppState {
  navigationExpanded: boolean;
  toggleNavigation: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  navigationExpanded: true,
  toggleNavigation: () => set((state) => ({ navigationExpanded: !state.navigationExpanded })),
}));