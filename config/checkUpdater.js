const { ipcMain } = require('electron');
const { NsisUpdater } = require('electron-updater');

/** Apply check update related logic **/
let autoUpdater;
let UPDATA_DOWNLOADED_NOT_INSTALLED = false

const checkUpdater =  (window, envConf) => {

    // Instantiate autoUpdater
    autoUpdater = new NsisUpdater({
        provider: 'generic',
        url: `https://${envConf.defaultArch }.myapp.com/update/` // Define different upgrade addresses based on different environment variables, same as the config.js publish.url
    })

    if (!autoUpdater) {
        return
    }

    // Checking for updates
    autoUpdater.on('checking-for-update', () => {
        window.webContents.send('UPDATA_CHECKING', {
            message: 'Checking for updates...'
        })
    })

    // Error checking for updates
    autoUpdater.on('error', (error) => {
        window.webContents.send('UPDATA_ERROR', {message: 'Error checking for updates'}, error);
    })

    // New version detected
    autoUpdater.on('update-available', (info) => {
        window.webContents.send('UPDATA_AVAILABLE', {message: `New version detected v ${info.version}, start download`})
    })

    // Already is the latest version
    autoUpdater.on('update-not-available', (info) => {
        window.webContents.send('UPDATA_NOT_AVAILABLE', {message: `Current version is the latest v ${info.version}`})
    })

    // Update downloading
    autoUpdater.on('download-progress', (percent) => {window.setProgressBar(percent / 100)})

    // Update download completed
    autoUpdater.on('update-downloaded', () => {
        window.webContents.send('UPDATA_DOWNLOADED');
    })

    // Cancel update now
    ipcMain.handle('UPDATA_DOWNLOADED_NOT_INSTALLED', () => {
        UPDATA_DOWNLOADED_NOT_INSTALLED = true
    })

    // Click Check for Updates
    ipcMain.handle('CHECK_UPDATA', () => {
        autoUpdater.checkForUpdatesAndNotify();
    })

    // Click to update now
    ipcMain.handle('UPDATA_QUITANDINSTALL', () => {
        autoUpdater.quitAndInstall();
    })

    autoUpdater.checkForUpdatesAndNotify();
}

module.exports = { autoUpdater, UPDATA_DOWNLOADED_NOT_INSTALLED, checkUpdater }