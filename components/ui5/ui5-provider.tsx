"use client";

import { setLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import { ThemeProvider } from "@ui5/webcomponents-react/ThemeProvider";
import { useEffect, useSyncExternalStore } from "react";
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/action-settings.js";
import "@ui5/webcomponents-icons/dist/activate.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/business-objects-experience.js";
import "@ui5/webcomponents-icons/dist/collapse-group.js";
import "@ui5/webcomponents-icons/dist/download.js";
import "@ui5/webcomponents-icons/dist/display-more.js";
import "@ui5/webcomponents-icons/dist/expand-group.js";
import "@ui5/webcomponents-icons/dist/folder-full.js";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/information.js";
import "@ui5/webcomponents-icons/dist/list.js";
import "@ui5/webcomponents-icons/dist/menu2.js";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import "@ui5/webcomponents-icons/dist/play.js";
import "@ui5/webcomponents-icons/dist/process.js";
import "@ui5/webcomponents-icons/dist/product.js";
import "@ui5/webcomponents-icons/dist/refresh.js";
import "@ui5/webcomponents-icons/dist/save.js";
import "@ui5/webcomponents-icons/dist/search.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/slim-arrow-right.js";
import "@ui5/webcomponents-icons/dist/status-in-process.js";
import "@ui5/webcomponents-icons/dist/status-positive.js";
import "@ui5/webcomponents-icons/dist/table-view.js";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Ui5Provider({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = "zh-CN";
    document.documentElement.dir = "ltr";
    void setTheme("sap_fiori_3");
    void setLanguage("zh_CN");
  }, []);

  if (!mounted) {
    return <div className="app-startup" aria-busy="true" aria-label="正在初始化应用" />;
  }

  return <ThemeProvider>{children}</ThemeProvider>;
}