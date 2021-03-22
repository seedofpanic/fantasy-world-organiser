const {ipcRenderer, contextBridge} = require('electron');

let loadingPromise = new Promise((resolve) => {
  contextBridge.exposeInMainWorld('loadData', (cb) => {
    resolve(cb);
  });
});

function save(data, cb) {
  if (cb) {
    ipcRenderer.once('saved', cb);
  }

  ipcRenderer.send('save', data);
}

contextBridge.exposeInMainWorld('saveData', save);

ipcRenderer.on('loaded', (e, arg) => {
  loadingPromise.then((cb) => cb(arg));
});
