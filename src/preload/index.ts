import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  runAudit: () => ipcRenderer.invoke('run-audit'),
})