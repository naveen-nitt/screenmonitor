export {};

declare global {
  interface Window {
    electronAPI?: {
      captureScreen: () => Promise<string | null>;
      onHotkeyTriggered: (callback: () => void) => void;
      removeHotkeyHandler: () => void;
    };
  }
}
