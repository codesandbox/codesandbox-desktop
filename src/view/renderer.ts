import type { TabGroup, Tab } from "electron-tabs";
import "electron-tabs";
import { urls } from "./config";
import { ipcRenderer } from "electron";
import { storage } from "./storage";
import { toggleBackgroundColor } from "./helpers";

const tabGroup = document.querySelector("tab-group") as TabGroup;

const setupTabs = () => {
  /**
   * Dashboard
   */
  tabGroup.addTab({
    webviewAttributes: { allowpopups: true },
    title: "",
    src: urls.dashboard,
    iconURL:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='35px' height='24px' viewBox='0 0 452 452'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 452h452V0H0v452zm405.773-46.227V46.227H46.227v359.546h359.546z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E",
    active: true,
    closable: false,
  });

  /**
   * Recover open tabs
   */
  storage.get().forEach((item) => {
    const tab = tabGroup.addTab(item);

    if (item.active) {
      toggleBackgroundColor(tabGroup, tab);
    }
  });

  /**
   * New tabs from dashboard
   */
  ipcRenderer.on("open-tab", (event, url) => {
    tabGroup.addTab({
      webviewAttributes: { allowpopups: true, id: new Date().getTime() },
      title: "Loading...",
      active: true,
      src: url,
      ready(tab) {
        storage.add({
          active: true,
          src: url,
          title: tab.title,
          webviewAttributes: tab.webviewAttributes as any,
        });

        /**
         * Update title
         */
        const view = tab.webview as unknown as Tab;
        view.addEventListener("did-stop-loading", () => {
          let title = view.getTitle();

          if (title === "CodeSandbox") {
            title = "Loading...";
          } else {
            title = title.replace(" - CodeSandbox", "");
          }

          tab.setTitle(title);

          storage.update(tab.webviewAttributes.id, {
            title: tab.title,
          });
        });
      },
    });
  });

  /**
   * Close tab
   */
  tabGroup.on("tab-removed", (tab) => {
    storage.delete(tab.webviewAttributes.id);
  });

  /**
   * Update active and background color
   */
  tabGroup.on("tab-active", (tab) => {
    toggleBackgroundColor(tabGroup, tab);
    storage.update(tab.webviewAttributes.id, { active: true });
  });
};

setupTabs();
