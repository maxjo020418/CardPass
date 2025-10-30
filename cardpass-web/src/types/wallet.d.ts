declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect?: () => Promise<any>;
        disconnect?: () => Promise<void>;
      };
    };
    solflare?: {
      isSolflare?: boolean;
      connect?: () => Promise<any>;
      disconnect?: () => Promise<void>;
    };
  }
}

export {};