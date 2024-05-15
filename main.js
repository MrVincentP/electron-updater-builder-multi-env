const { app, BrowserWindow, Menu, } = require('electron');
const path = require('path');
const { devTopMenus, prodTopMenus } = require(path.join(__dirname, "utils/topMenus"));
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const { checkUpdater } = require(path.join(__dirname, "config/checkUpdater"));
const envConf = require(path.join(__dirname, "config/config"));
console.log("envConf", envConf);
const electron = require('electron')

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});

let mainWindow;
const createWindow = () => {
  /* Create a browser window */
  mainWindow = new BrowserWindow({
    width: 2560,
    height: 1440,
    show: false,
    //frame: false, // border
    //fullscreen: true, // Full screen without close and minimize buttons
    resizable: false, // scalable
    movable: true, // it can move
    maximizable: false,
    transparent: true,
    alwaysOnTop: false,
    hasShadow: false,
    enableLargerThanScreen: false,
    icon: `./logo/${envConf.releaseInfo.vendor.name}.ico`,
    title: `${envConf.releaseInfo.vendor.author+envConf.releaseInfo.vendor.version}AppName`,
    webPreferences: { // Allowed to use require
      cache: true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true, // Enable remote module
      preload: envConf.defaultArch === 'dev' ? path.join(__dirname, 'preload.js'): path.join(process.resourcesPath, '../preload.js'),
      webPreferences: {
        disableWebSecurity: true
      }
    }
  })
  require('@electron/remote/main').initialize();
  require("@electron/remote/main").enable(mainWindow.webContents);
  /* Load index.html into a new BrowserWindow instance */
  mainWindow.loadURL(envConf.releaseInfo.vendor[envConf.defaultArch]);
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  mainWindow.on('close', e => {
    console.log("When the current window is closing.....");
    // mainWindow = null;
    e.preventDefault(); // Stop the default behavior first, otherwise it will be turned off directly and the prompt box will only flash once.
    electron.dialog.showMessageBox({
      type: 'info',
      title: 'Notice',
      message:'confirm Exit？',
      buttons: ['Confirm', 'Cancel'],   // Select the button and click Confirm, the idx below is 0, Cancel is 1
      cancelId: 1, // The value of this is the value returned if you directly delete the prompt box. It is set to the same value as the "Cancel" button, and the idx below will also be 1.
    }).then(idx => {
      // Note that ↑ above uses then. Many people on the Internet directly use the method as the second parameter of showMessageBox. My test was unsuccessful.
      console.log(idx)
      if (idx.response === 1) {
        console.log('index==1, cancel close')
        e.preventDefault();
      } else {
        console.log('index==0, closed')
        mainWindow = null;
        app.exit();
      }
    })
  });

  mainWindow.webContents.on('did-finish-load', async()=> {
    console.log("Loading completed.....");
  })

  //devTopMenus, prodTopMenus
  const menu = Menu.buildFromTemplate(envConf.defaultArch !== 'prod' ? devTopMenus : (envConf.defaultArch === 'prod' && envConf.appId.includes('ForGame')) ?  devTopMenus : prodTopMenus);
  Menu.setApplicationMenu(menu);

  // Try to update, only triggered when the user opens the app for the first time
  if(envConf.defaultArch !== 'dev'){
    checkUpdater(mainWindow, envConf);
  }
}

console.log("url", envConf.releaseInfo.vendor[envConf.defaultArch]);
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  console.log('2')
});


app.whenReady().then(() => {
  createWindow();
  app.on('activate', ()=> {
    /* The activate event is an event customized for macOS systems */
    /* In macOS system */
    /* Clicking the dock icon when no other windows are open will usually recreate a window within the application */
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  console.log('1')
});