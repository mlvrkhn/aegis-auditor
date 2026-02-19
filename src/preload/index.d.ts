interface ElectronAPI {
  runAudit: () => Promise<any[]>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}