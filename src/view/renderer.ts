import type { TabGroup } from "electron-tabs";
import "electron-tabs";
import { urls } from "./config";

const tabGroup = document.querySelector("tab-group") as TabGroup;

const setupTabs = () => {
  const home = tabGroup.addTab({
    title: "",
    src: urls.dashboard,
    iconURL:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='35px' height='24px' viewBox='0 0 452 452'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 452h452V0H0v452zm405.773-46.227V46.227H46.227v359.546h359.546z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E",
    active: true,
    closable: false,
    webviewAttributes: {
      allowpopups: true,
    },
  });

  tabGroup.addTab({
    title: "foo",
    active: true,
    webviewAttributes: {
      allowpopups: true,
    },
    src: "https://codesandbox.io/p/github/codesandbox/codesandbox-applications/main",
  });
};

setupTabs();
