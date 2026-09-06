import { createRoot } from "react-dom/client";
import Workspace, { type WorkspaceOptions } from "./features/product-configurator/pages/Workspace";
import { store } from "./features/product-configurator/model/store";

window.FeatureWorkspace = {
  mount(host: HTMLElement, options: WorkspaceOptions) {
    const root = createRoot(host);
    root.render(<Workspace {...options} />);
    return { destroy: () => root.unmount() };
  },
  setPage: store.setPage,
  getGenerated: () => store.getSnapshot().generated
};
