// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  screen: electronScreen,
  shell,
} = require("electron");
const path = require("path");

const createWindow = () => {
  const primaryDisplay = electronScreen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    titleBarStyle: "hidden",
    frame: false,
    webPreferences: {
      webviewTag: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("./dist/index.html");

  if (process.env.NODE_ENV === "development") {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  app.on("web-contents-created", (createEvent, contents) => {
    const allowedExternalUrls = [".preview.csb.app", "github.com"];

    // contents.on("new-window", (newEvent) => {
    //   console.log("Blocked by 'new-window'", newEvent.url);
    //   newEvent.preventDefault();
    // });

    // contents.on("will-navigate", (newEvent) => {
    //   console.log("Blocked by 'will-navigate'", newEvent);
    //   newEvent.preventDefault();
    // });

    contents.setWindowOpenHandler(({ url }) => {
      if (allowedExternalUrls.find((allowedUrl) => url.includes(allowedUrl))) {
        shell.openExternal(url);

        return { action: "deny" };
      }

      return { action: "allow" };
    });
  });

  // mainWindow.webContents.setWindowOpenHandler((details) => {
  //   console.log(details);
  //   return { action: "allow" };
  // });
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
