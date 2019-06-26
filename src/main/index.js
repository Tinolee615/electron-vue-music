import { app, BrowserWindow,ipcMain } from 'electron'
import '../renderer/store'
import path from 'path'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
console.log('----------',process.env.NODE_ENV)
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1200,
    frame:false,
    webPreferences:{
      nodeIntegration:true,//默认为false，true时渲染进程支持node
    }
  })
  if(process.env.NODE_ENV === 'development'){
    BrowserWindow.addDevToolsExtension(path.resolve(__dirname, '../../devTools/vue-devtools'));
  }
  mainWindow.closeDevTools();
  // mainWindow.openDevTools();
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
ipcMain.on('open',e=>{
  mainWindow.openDevTools();
})
ipcMain.on('min',e=>mainWindow.minimize())
ipcMain.on('max',e=>{
  if(mainWindow.isMaximized()){
    mainWindow.unmaximize()
  }else{
    mainWindow.maximize()
  }
})
ipcMain.on('close',e=>{
  mainWindow.close()
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
