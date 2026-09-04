"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface ThreeColumnWorkspaceProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  label?: string;
}

type ResizeTarget = "left" | "right";

export function ThreeColumnWorkspace({
  left,
  center,
  right,
  label = "工作区",
}: ThreeColumnWorkspaceProps) {
  const [leftWidth, setLeftWidth] = useState(25);
  const [rightWidth, setRightWidth] = useState(25);
  const [resizing, setResizing] = useState<ResizeTarget | null>(null);

  useEffect(() => {
    if (!resizing) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const width = window.innerWidth;
      const percentage = (event.clientX / width) * 100;

      if (resizing === "left") {
        setLeftWidth(Math.min(38, Math.max(18, percentage)));
      } else {
        setRightWidth(Math.min(38, Math.max(18, 100 - percentage)));
      }
    };
    const handlePointerUp = () => setResizing(null);

    document.body.classList.add("is-resizing");
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      document.body.classList.remove("is-resizing");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [resizing]);

  const adjustWithKeyboard = (target: ResizeTarget, direction: number) => {
    if (target === "left") {
      setLeftWidth((value) => Math.min(38, Math.max(18, value + direction)));
    } else {
      setRightWidth((value) => Math.min(38, Math.max(18, value - direction)));
    }
  };

  return (
    <div
      className="three-column-workspace"
      aria-label={label}
      style={{
        gridTemplateColumns: `${leftWidth}% 8px minmax(320px, 1fr) 8px ${rightWidth}%`,
      }}
    >
      <div className="workspace-column">{left}</div>
      <div
        className="workspace-resizer"
        role="separator"
        aria-label="调整左侧面板宽度"
        aria-orientation="vertical"
        tabIndex={0}
        onPointerDown={() => setResizing("left")}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") adjustWithKeyboard("left", -2);
          if (event.key === "ArrowRight") adjustWithKeyboard("left", 2);
        }}
      />
      <div className="workspace-column">{center}</div>
      <div
        className="workspace-resizer"
        role="separator"
        aria-label="调整右侧面板宽度"
        aria-orientation="vertical"
        tabIndex={0}
        onPointerDown={() => setResizing("right")}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") adjustWithKeyboard("right", -2);
          if (event.key === "ArrowRight") adjustWithKeyboard("right", 2);
        }}
      />
      <div className="workspace-column">{right}</div>
    </div>
  );
}