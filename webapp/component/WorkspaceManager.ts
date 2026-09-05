import type Router from "sap/ui/core/routing/Router";

export default class WorkspaceManager {
  public static open(
    router: Router,
    routeName: string,
    parameters: Record<string, string> = {}
  ): void {
    router.navTo(routeName, parameters);
  }
}
