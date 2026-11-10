type ConstraintBlueprintNodeKind = "source" | "condition" | "logic" | "action";
import type { ConstraintBlueprintLayout, ConstraintRuleAst } from "../model/constraintRules";
import type { BlueprintPredicateSelection } from "../blueprint/constraint-blueprint";

interface ConstraintBlueprintHandle {
  addNode: (kind: ConstraintBlueprintNodeKind) => void;
  addScope: () => void;
  fit: () => void;
  setExample: (id: string) => void;
  loadConstraintAST: (
    ast: ConstraintRuleAst,
    layout?: ConstraintBlueprintLayout,
    featureLabels?: Record<string, string>
  ) => void;
  exportConstraintAST: () => ConstraintRuleAst | undefined;
  exportConstraintBlueprint: () => ConstraintBlueprintLayout;
  setOnBlueprintChange: (
    handler: (ast: ConstraintRuleAst, layout: ConstraintBlueprintLayout) => void
  ) => void;
  setOnPredicateSelection: (handler: (selection: BlueprintPredicateSelection | undefined) => void) => void;
  updatePredicate: (id: string, predicate: BlueprintPredicateSelection["predicate"]) => void;
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
