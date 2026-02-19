import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { runAllChecks } from './securityChecks'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'macOS Aegis Auditor',
    width: 980,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
    },
    show: false,
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.once('ready-to-show', () => mainWindow?.show())

  // Fullscreen detection
  const sendFullscreenState = () => {
    mainWindow?.webContents.send('fullscreen-change', mainWindow.isFullScreen())
  }

  mainWindow.on('enter-full-screen', sendFullscreenState)
  mainWindow.on('leave-full-screen', sendFullscreenState)
  mainWindow.on('resize', () => { // optional extra responsiveness
    sendFullscreenState()
  })

  // Send initial state
  setTimeout(sendFullscreenState, 500)
}

ipcMain.handle('run-audit', async () => {
  return runAllChecks()
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})