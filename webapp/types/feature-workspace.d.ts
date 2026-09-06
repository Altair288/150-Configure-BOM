import type { WorkspaceOptions } from "../../frontend/features/product-configurator/pages/Workspace";
import type {
  ConfiguredBom,
  WorkspacePage
} from "../../frontend/features/product-configurator/model/types";
declare global {
  interface Window {
    FeatureWorkspace?: {
      mount: (host: HTMLElement, options: WorkspaceOptions) => { destroy: () => void };
      setPage: (page: WorkspacePage) => void;
      getGenerated: () => ConfiguredBom | undefined;
    };
  }
}
