import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  runAudit: () => Promise<any>
  onFullscreenChange: (callback: (isFullscreen: boolean) => void) => void
}

contextBridge.exposeInMainWorld('electronAPI', {
  runAudit: () => ipcRenderer.invoke('run-audit'),
  onFullscreenChange: (callback: (isFullscreen: boolean) => void) => {
    ipcRenderer.on('fullscreen-change', (_, isFullscreen) => callback(isFullscreen))
  },
} as ElectronAPI)