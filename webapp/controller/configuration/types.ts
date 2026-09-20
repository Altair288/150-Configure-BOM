import type {
  ConfigurationContext,
  ConfigurationProfile,
  ConfigurationStore,
  FeatureDefinition,
  FeatureFamily,
  FeatureGroup,
  Named
} from "../../model/configuration";
import type Control from "sap/ui/core/Control";

export type Field = {
  key: string;
  label: string;
  value: string | number | boolean;
  options?: string[];
  required?: boolean;
  multiline?: boolean;
  numeric?: boolean;
  valueHelp?: (setValue: (value: string) => void) => void;
};

export type Values = Record<string, string | number | boolean>;

export type Selection = { kind: "group" | "family" | "feature"; id: string };

export type TreeNode = {
  id: string;
  kind: string;
  name: string;
  code: string;
  dimension: string;
  type: string;
  source: string;
  icon: string;
  children: TreeNode[];
};

export type ConfigurationSelectionRecord =
  | FeatureGroup
  | FeatureFamily
  | FeatureDefinition
  | Named;

export type ConfigurationCommit = (
  change: (next: ConfigurationStore) => void,
  message?: string
) => boolean;

export type ConfigurationControl = Control;

export interface FeatureWorkspaceOptions {
  store: ConfigurationStore;
  context: ConfigurationContext;
  profile: ConfigurationProfile;
  getSelection: () => Selection | undefined;
  treeSearch: string;
  dimensionFilter: string;
  editorTab: string;
  onTreeSearchChanged: (value: string) => void;
  onDimensionChanged: (value: string) => void;
  onEditorTabChanged: (value: string) => void;
  onSelection: (selection: Selection | undefined) => void;
  onEditGroup: (group?: FeatureGroup) => void;
  onEditFamily: (family?: FeatureFamily) => void;
  onAddFeature: () => void;
  onReuseFeature: () => void;
  onDeleteNode: () => void;
  onCopyNode: () => void;
  onMoveNode: () => void;
  onOpenLibrary: () => void;
  onPreview: () => void;
  onEditDefinition: (definition: FeatureDefinition) => void;
  onEditDomain: (definition: FeatureDefinition) => void;
  saveDefinition: (definition: FeatureDefinition) => boolean;
  canEdit: () => boolean;
  commit: ConfigurationCommit;
}