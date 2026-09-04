"use client";

import { BusyIndicator } from "@ui5/webcomponents-react/BusyIndicator";

export function LoadingState({ label = "正在加载" }: { label?: string }) {
  return (
    <div className="state-panel" role="status">
      <BusyIndicator active size="M" />
      <span>{label}</span>
    </div>
  );
}