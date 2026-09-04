"use client";

import { Tag } from "@ui5/webcomponents-react/Tag";

type StatusTagProps = {
  status: string;
  tone?: "Positive" | "Critical" | "Information" | "Neutral" | "Negative";
};

export function StatusTag({ status, tone = "Neutral" }: StatusTagProps) {
  return <Tag design={tone}>{status}</Tag>;
}