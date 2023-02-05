import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

ipcMain.handle('picksrc', async () => {
    const result = await dialog.showOpenDialog({
        title: 'Choose Video Source',
        properties: ['openFile'],
        filters: [
            { name: 'Video Files', extensions: ['mkv', 'webm', 'mp4', 'avi'] }
        ]
    });

    if (result.canceled || result.filePaths.length < 1) {
        return null;
    }

    return result.filePaths[0];
});

ipcMain.handle('pickdir', async () => {
    const result = await dialog.showOpenDialog({
        title: 'Choose Output Folder',
        properties: ['openDirectory']
    });

    if (result.canceled || result.filePaths.length < 1) {
        return null;
    }

    return result.filePaths[0];
});

let childProcess: ChildProcessWithoutNullStreams;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 678,
    width: 709,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const root = (__dirname.split('\\').slice(0, -2)).join('\\');
  childProcess = spawn('node', [path.join(root, 'src/server')]);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('before-quit', () => {
    childProcess.kill();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
