const {app, BrowserWindow, ipcMain, Menu, MenuItem, dialog} = require('electron');
const path = require('path');
const fs = require('fs');

const configPath = 'app.config';
let config;

function updateConfig(key, value) {
  config[key] = value;
  saveConfig();
}

function loadConfig() {
  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, {encoding: 'utf8'});

    try {
      config = JSON.parse(configData);
    } catch (e) {
      config = {};
      throw 'config file content is damaged';
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
    title: 'Fantasy World Organizer',
    width: 2000,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // win.loadURL('http://localhost:3000/');
  win.loadFile('build/index.html');

  return win;
}

const saveEvent = {
  type: 'keyDown',
  keyCode: 's',
  modifiers: ['ctrl']
};

function constructMenus(win) {
  const menu = Menu.getApplicationMenu();

  menu.items[0].submenu.insert(0, new MenuItem({
    label: 'New', click: () => {
      requestSaveAs(win, true);
    }
  }));
  menu.items[0].submenu.insert(1, new MenuItem({
    label: 'Open', click: () => {
      const path = dialog.showOpenDialogSync({
        filters: [{
          name: 'fws',
          extensions: ['fws']
        }],
        defaultPath: __dirname
      });

      if (path && path[0]) {
        updateConfig('savingPath', path[0]);
        load(win);
      }
    }
  }));
  menu.items[0].submenu.insert(2, new MenuItem({
    label: 'Save', click: () => {
      win.webContents.sendInputEvent(saveEvent);
    }
  }));
  menu.items[0].submenu.insert(3, new MenuItem({
    label: 'Save As', click: () => {
      requestSaveAs(win, false);
    }
  }));
}

function requestSaveAs(win, clear) {
  const path = dialog.showSaveDialogSync({
    filters: [{
      name: 'fws',
      extensions: ['fws']
    }],
    defaultPath: __dirname
  });

  if (path) {
    updateConfig('savingPath', path);

    if (clear) {
      win.webContents.send('loaded', {fileName: path});
    }

    win.webContents.sendInputEvent(saveEvent);
  }
}

app.whenReady().then(() => {
  let win = createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow();
    }
  });

  // win.webContents.openDevTools();
  constructMenus(win);

  if (config.savingPath) {
    load(win);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

ipcMain.on('save', (e, data) => {
  fs.writeFile(config.savingPath, data, {encoding: 'utf8'}, () => {
    e.reply('saved');
  });
});

function load(win) {
  const fileName = config.savingPath;

  if (!fs.existsSync(fileName)) {
    return;
  }

  const data = fs.readFileSync(fileName, {encoding: 'utf8'});

  win.webContents.send('loaded', {data, fileName});
}
