import { createStore } from "solid-js/store";
import { createSignal, onCleanup } from "solid-js";
import type { Adapter } from "@solana/wallet-adapter-base";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import {
  getAvailableWallets,
  sortWalletsByReadyState,
  type WalletConfig,
} from "~/lib/wallet-manager";
import { AuthClient, signMessage, encodeSignature } from "~/lib/auth-client";

export interface WalletState {
  isInitialized: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  isModalOpen: boolean;
  adapter: Adapter | null;
  wallets: WalletConfig[];
  publicKey: string | null;
  walletName: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
}

const [walletState, setWalletState] = createStore<WalletState>({
  isInitialized: false,
  isConnected: false,
  isConnecting: false,
  isModalOpen: false,
  adapter: null,
  wallets: [],
  publicKey: null,
  walletName: null,
  isAuthenticated: false,
  isAuthenticating: false,
  authError: null,
});

const authClient = new AuthClient();

const LAST_WALLET_KEY = "cardpass-last-wallet";

// Initialize wallet system
export async function initializeWallet() {
  if (walletState.isInitialized) return;

  // Skip initialization on server side
  if (typeof window === "undefined") {
    return;
  }

  // Get available wallets
  const availableWallets = getAvailableWallets();
  const sortedWallets = sortWalletsByReadyState(availableWallets);

  setWalletState({
    wallets: sortedWallets,
    isInitialized: true,
  });

  // Check if user is already authenticated
  try {
    const authInfo = await authClient.me();
    if (authInfo) {
      setWalletState({
        isAuthenticated: true,
        publicKey: authInfo.sub,
      });
    }
  } catch (error) {
    // Not authenticated, ignore error
  }

  // Auto-connect last used wallet
  const lastWalletName = localStorage.getItem(LAST_WALLET_KEY);
  if (lastWalletName) {
    const wallet = sortedWallets.find(w => w.name === lastWalletName);
    if (wallet && wallet.readyState !== "NotDetected") {
      console.log(`Auto-connecting to ${lastWalletName}...`);
      try {
        await connectWallet(wallet, true); // true = auto-connect
      } catch (error) {
        console.error("Auto-connect failed:", error);
        localStorage.removeItem(LAST_WALLET_KEY);
      }
    }
  }
}

// Connect to a wallet
export async function connectWallet(walletConfig: WalletConfig, isAutoConnect = false) {
  const { adapter, readyState } = walletConfig;

  // Check if wallet is not installed and handle accordingly
  if (readyState === "NotDetected") {
    setWalletState({ isConnecting: false });

    // Don't open installation page on auto-connect
    if (!isAutoConnect) {
      // Open installation page for the wallet
      if (walletConfig.name === "Phantom") {
        window.open("https://phantom.app/download", "_blank");
      } else if (walletConfig.name === "Solflare") {
        window.open("https://solflare.com/download", "_blank");
      }
    }

    return;
  }

  try {
    setWalletState({ isConnecting: true });

    // Check current auth status before connecting
    let currentAuthInfo = null;
    try {
      currentAuthInfo = await authClient.me();
    } catch {
      // Not authenticated
    }

    // Set up event listeners
    const handleConnect = async () => {
      const publicKey = adapter.publicKey?.toString() || null;

      setWalletState({
        isConnected: true,
        publicKey,
        walletName: adapter.name,
      });

      // Only authenticate if not already authenticated or if it's a different wallet
      if (publicKey) {
        // Check if already authenticated with the same wallet
        if (currentAuthInfo && currentAuthInfo.sub === publicKey) {
          console.log("Already authenticated with this wallet, skipping signature");
          setWalletState({
            isAuthenticated: true,
            authError: null,
          });
          return;
        }

        // New wallet or not authenticated, require signature
        await authenticateWallet(adapter);
      }
    };

    const handleDisconnect = async () => {
      setWalletState({
        isConnected: false,
        adapter: null,
        publicKey: null,
        walletName: null,
        isAuthenticated: false,
      });

      // Clear saved wallet
      localStorage.removeItem(LAST_WALLET_KEY);

      // Logout from backend
      try {
        await authClient.logout();
      } catch (error) {
        console.error("Failed to logout:", error);
      }
    };

    const handleError = (error: any) => {
      console.error(`Wallet error (${adapter.name}):`, error);
      // Reset connecting state on error
      setWalletState({ isConnecting: false });
    };

    adapter.on("connect", handleConnect);
    adapter.on("disconnect", handleDisconnect);
    adapter.on("error", handleError);

    // Connect to the wallet
    await adapter.connect();

    setWalletState({
      adapter,
      isConnecting: false,
      isModalOpen: false,
    });

    // Save last connected wallet
    localStorage.setItem(LAST_WALLET_KEY, walletConfig.name);

    // Cleanup function for when adapter changes
    onCleanup(() => {
      adapter.off("connect", handleConnect);
      adapter.off("disconnect", handleDisconnect);
      adapter.off("error", handleError);
    });
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    setWalletState({
      isConnecting: false,
      adapter: null,
    });

    // Don't throw error for auto-connect, fail silently
    if (!isAutoConnect) {
      throw error;
    }
  }
}

// Authenticate wallet with backend
async function authenticateWallet(adapter: Adapter) {
  if (!adapter.publicKey) {
    throw new Error("Wallet not connected");
  }

  const publicKey = adapter.publicKey.toString();

  try {
    setWalletState({
      isAuthenticating: true,
      authError: null,
    });

    // Step 1: Get challenge from backend
    const challenge = await authClient.createChallenge({
      wallet: publicKey,
      purpose: "Login",
      domain: window.location.hostname,
    });

    // Step 2: Sign the challenge message
    const signature = await signMessage(adapter, challenge.message);
    const encodedSignature = encodeSignature(signature, "base64");

    // Step 3: Verify signature with backend
    const verifyResponse = await authClient.verifyChallenge({
      wallet: publicKey,
      nonce: challenge.nonce,
      signature: encodedSignature,
      signature_encoding: "base64",
    });

    if (verifyResponse.ok) {
      setWalletState({
        isAuthenticated: true,
        isAuthenticating: false,
        authError: null,
      });
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error: any) {
    console.error("Authentication error:", error);
    setWalletState({
      isAuthenticated: false,
      isAuthenticating: false,
      authError: error.message || "Authentication failed",
    });
    throw error;
  }
}

// Disconnect wallet
export async function disconnectWallet() {
  try {
    // Disconnect wallet if connected
    if (walletState.adapter) {
      try {
        await walletState.adapter.disconnect();
      } catch (error) {
        console.error("Failed to disconnect wallet adapter:", error);
      }
    }

    // Clear all state
    setWalletState({
      isConnected: false,
      adapter: null,
      publicKey: null,
      walletName: null,
      isAuthenticated: false,
      authError: null,
    });

    // Clear saved wallet
    localStorage.removeItem(LAST_WALLET_KEY);

    // Logout from backend
    try {
      await authClient.logout();
    } catch (error) {
      console.error("Failed to logout from backend:", error);
    }
  } catch (error) {
    console.error("Failed to disconnect:", error);
    // Still clear state even if disconnect fails
    setWalletState({
      isConnected: false,
      adapter: null,
      publicKey: null,
      walletName: null,
      isAuthenticated: false,
      authError: null,
    });
    localStorage.removeItem(LAST_WALLET_KEY);
  }
}

// Modal controls
export function openWalletModal() {
  setWalletState({ isModalOpen: true });
}

export function closeWalletModal() {
  setWalletState({ isModalOpen: false });
}

// Check auth status on app load
export async function checkAuthStatus() {
  // Skip on server side
  if (typeof window === "undefined") {
    return;
  }

  try {
    const authInfo = await authClient.me();
    if (authInfo && authInfo.sub) {
      setWalletState({
        isAuthenticated: true,
        publicKey: authInfo.sub,
        // Note: We can't restore wallet connection automatically
        // because wallet adapters need user interaction
        // But we keep the auth status to show user is logged in
      });

      console.log("Auth restored for wallet:", authInfo.sub);
    }
  } catch (error) {
    // Not authenticated or auth expired, ignore
    console.log("No valid auth session found");
  }
}

// Re-authenticate existing wallet connection
export async function reAuthenticateWallet() {
  if (!walletState.adapter || !walletState.publicKey) {
    return;
  }

  try {
    await authenticateWallet(walletState.adapter);
  } catch (error) {
    console.error("Re-authentication failed:", error);
    // If re-auth fails, clear auth state but keep wallet connected
    setWalletState({
      isAuthenticated: false,
      authError: "Session expired. Please reconnect wallet.",
    });
  }
}

// Export state
export { walletState };

// Hook for easy access to wallet state and functions
export function useWallet() {
  return {
    connected: () => walletState.isAuthenticated,
    publicKey: () => walletState.publicKey,
    wallet: () => walletState.adapter,
    walletName: () => walletState.walletName,
    isConnecting: () => walletState.isConnecting,
    isAuthenticating: () => walletState.isAuthenticating,
    connect: connectWallet,
    disconnect: disconnectWallet,
    openModal: openWalletModal,
    closeModal: closeWalletModal,
  };
}