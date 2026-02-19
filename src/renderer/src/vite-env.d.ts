/// <reference types="vite/client" />

// Shared interface for the exposed API
export interface ElectronAPI {
  runAudit: () => Promise<CheckResult[]>
  onFullscreenChange: (callback: (isFullscreen: boolean) => void) => void
}

export interface CheckResult {
  id: string
  name: string
  category: string
  passed: boolean
  details: string
  weight: number  
  description: string
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}