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
    active: true,
    closable: false,
  });

  // Set icon
  tabGroup
    .getTabByPosition(0)
    .element.querySelector(
      ".tab-icon"
    ).innerHTML = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2.375 6.65587C2.375 6.35909 2.50682 6.07765 2.73482 5.88765L7.35982 2.03349C7.73066 1.72445 8.26934 1.72445 8.64018 2.03349L13.2652 5.88765C13.4932 6.07765 13.625 6.3591 13.625 6.65587V13.625C13.625 14.1773 13.1773 14.625 12.625 14.625H10.875C10.3227 14.625 9.875 14.1773 9.875 13.625V10.9375C9.875 10.3852 9.42728 9.9375 8.875 9.9375H7.125C6.57272 9.9375 6.125 10.3852 6.125 10.9375V13.625C6.125 14.1773 5.67728 14.625 5.125 14.625H3.375C2.82272 14.625 2.375 14.1773 2.375 13.625V6.65587Z" stroke="currentColor" fill="transparent" stroke-linecap="round"></path></svg>`;

  /**
   * Recover open tabs
   */
  storage.get().forEach((item) => {
    const tab = tabGroup.addTab(item);

    const view = tab.webview as unknown as Tab & { src: string };

    if (item.active) {
      toggleBackgroundColor(tabGroup, tab);
    }

    /**
     * Update URL
     */
    view.addEventListener("did-navigate-in-page", () => {
      storage.update(tab.webviewAttributes.id, {
        src: view.src,
      });
    });

    /**
     * Update title
     */
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
   * Close Tab
   */
  ipcRenderer.addListener("close-tab", () => {
    tabGroup.getActiveTab().close(true);
  });

  /**
   * Close file
   */
  ipcRenderer.addListener("close-file", () => {
    const iframe = tabGroup
      .getActiveTab()
      .webview.shadowRoot.querySelector("iframe");

    iframe.contentWindow.postMessage("__external__EDITOR-CLOSE_TABS", "*");
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
