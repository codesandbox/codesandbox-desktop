import type { TabGroup, Tab } from "electron-tabs";
import { urls } from "./config";

export const toggleBackgroundColor = (tabGroup: TabGroup, activeTab: Tab) => {
  const nav = tabGroup.shadowRoot.querySelector(".nav");

  if (activeTab.webviewAttributes.src.includes(urls.project)) {
    nav.classList.add("project");
  } else {
    nav.classList.remove("project");
  }
};
