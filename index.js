const setupEvents = require("./installer");
const debug = process.env.IS_DEBUG;

if (setupEvents.handleSquirrelEvent()) {
  return;
}

const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  dialog,
} = require("electron");
const path = require("path");
const fs = require("fs");

const configPath = __dirname + "app.config";
let config;

function updateConfig(key, value) {
  config[key] = value;
  saveConfig();
}

function loadConfig() {
  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, { encoding: "utf8" });

    try {
      config = JSON.parse(configData);
    } catch (e) {
      config = {};
      throw "config file content is damaged";
    }
  } else {
    config = {};
  }

  saveConfig();
}

function saveConfig() {
  fs.writeFileSync(configPath, JSON.stringify(config));
}

loadConfig();

function createWindow() {
  const win = new BrowserWindow({
    title: "Fantasy World Organiser",
    width: 2000,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (debug) {
    win.loadURL("http://localhost:3000/");
  } else {
    win.loadFile("build/index.html");
  }

  return win;
}

const saveEvent = {
  type: "keyDown",
  keyCode: "s",
  modifiers: ["ctrl"],
};

function constructMenus(win) {
  const template = [
    {
      label: "Electron",
      submenu: [{ role: "quit" }],
    },
    {
      label: "File",
      submenu: [
        {
          label: "New",
          click: () => {
            requestSaveAs(win, true);
          },
        },
        {
          label: "Open",
          click: () => {
            const path = dialog.showOpenDialogSync({
              filters: [
                {
                  name: "fws",
                  extensions: ["fws"],
                },
              ],
              defaultPath: __dirname,
            });

            if (path && path[0]) {
              updateConfig("savingPath", path[0]);
              load(win);
            }
          },
        },
        {
          label: "Save",
          click: () => {
            win.webContents.sendInputEvent(saveEvent);
          },
        },
        {
          label: "Save As",
          click: () => {
            requestSaveAs(win, false);
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { role: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteandmatchstyle" },
        { role: "delete" },
        { role: "selectall" },
      ],
    },
    {
      label: "Help",
      submenu: [
        { role: "reload" },
        { role: "toggleFullScreen" },
        { role: "toggleDevTools" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // const fileMenu = menu.items.find(menu => menu.role === 'filemenu');
}

function requestSaveAs(win, clear) {
  const path = dialog.showSaveDialogSync({
    filters: [
      {
        name: "fws",
        extensions: ["fws"],
      },
    ],
    defaultPath: __dirname,
  });

  if (path) {
    updateConfig("savingPath", path);

    if (clear) {
      win.webContents.send("loaded", { fileName: path, data: loadExample() });
    }

    win.webContents.sendInputEvent(saveEvent);
  }
}

app.whenReady().then(() => {
  let win = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow();
    }
  });

  if (debug) {
    win.webContents.openDevTools();
  }

  constructMenus(win);

  if (config.savingPath) {
    load(win);
  }
});

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("save", (e, data) => {
  fs.writeFile(config.savingPath, data, { encoding: "utf8" }, () => {
    e.reply("saved");
  });
});

function load(win) {
  const fileName = config.savingPath;

  if (!fs.existsSync(fileName)) {
    return;
  }

  const data = loadFromFile(fileName);

  win.webContents.send("loaded", { data, fileName });
}

function loadExample() {
  const exampleFileName = path.join(__dirname, "world.example");

  console.log(exampleFileName);
  if (!fs.existsSync(exampleFileName)) {
    console.log("oops");
    return "";
  }

  return loadFromFile(exampleFileName);
}

function loadFromFile(fileName) {
  return fs.readFileSync(fileName, { encoding: "utf8" });
}
