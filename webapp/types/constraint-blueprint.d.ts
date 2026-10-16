type ConstraintBlueprintNodeKind = "source" | "condition" | "logic" | "action";

interface ConstraintBlueprintHandle {
  addNode: (kind: ConstraintBlueprintNodeKind) => void;
  addScope: () => void;
  fit: () => void;
  setExample: (id: string) => void;
  validate: () => { nodes: number; connections: number };
  destroy: () => void;
}

declare global {
  interface Window {
    ConfigurationBlueprint?: {
      mount: (host: HTMLElement, initialRuleId?: string) => ConstraintBlueprintHandle;
    };
  }
}

export {};
