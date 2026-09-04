"use client";

import { MessageStrip } from "@ui5/webcomponents-react/MessageStrip";

export function ErrorState({ label = "数据加载失败，请稍后重试。" }: { label?: string }) {
  return (
    <div className="state-panel">
      <MessageStrip design="Negative">{label}</MessageStrip>
    </div>
  );
}