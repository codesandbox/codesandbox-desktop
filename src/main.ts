// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  screen: electronScreen,
  shell,
  globalShortcut,
  Menu,
} = require("electron");
const path = require("path");
const windowStateKeeper = require("electron-window-state");

const createWindow = () => {
  const primaryDisplay = electronScreen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  let mainWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  });

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    titleBarStyle: "customButtonsOnHover",
    trafficLightPosition: { x: 10, y: 10 },
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindowState.manage(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadFile("./assets/index.html");

  if (process.env.NODE_ENV === "development") {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  app.on("web-contents-created", (createEvent, webContents) => {
    const allowedExternalUrls = [".preview.csb.app", "github.com"];
    const deniedURls = ["https://codesandbox.io/p/github/"];
    const exceptions = [".preview.csb.app/auth/dev"];

    webContents.setWindowOpenHandler(({ url }) => {
      if (exceptions.find((allowedUrl) => url.includes(allowedUrl))) {
        return { action: "allow" };
      }

      if (allowedExternalUrls.find((allowedUrl) => url.includes(allowedUrl))) {
        shell.openExternal(url);

        return { action: "deny" };
      }

      if (deniedURls.find((allowedUrl) => url.includes(allowedUrl))) {
        mainWindow.webContents.send("open-tab", url);

        return { action: "deny" };
      }

      return { action: "allow" };
    });
  });

  /**
   * Disable command + w
   */
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        {
          label: "Close tab",
          accelerator: "CommandOrControl+Shift+W",
          click: () => {
            mainWindow.webContents.send("close-tab");
          },
        },
        { role: "quit" },
      ],
    },
    {
      role: "fileMenu",
      submenu: [
        {
          label: "Close file",
          accelerator: "CommandOrControl+W",
          click: () => {
            mainWindow.webContents.send("close-file");
          },
        },
      ],
    },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
  ]);
  Menu.setApplicationMenu(menu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
