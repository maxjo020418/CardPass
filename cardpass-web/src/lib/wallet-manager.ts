import type { Adapter, WalletReadyState } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

// Wallet configuration
export interface WalletConfig {
  name: string;
  icon: string;
  adapter: Adapter;
  readyState: WalletReadyState;
}

// Initialize all available wallets
export function getAvailableWallets(): WalletConfig[] {
  // Only initialize wallets on client side
  if (typeof window === "undefined") {
    return [];
  }

  const wallets: WalletConfig[] = [];

  // Add Phantom wallet
  try {
    const phantomAdapter = new PhantomWalletAdapter();
    // Manually check if Phantom is installed
    const isPhantomInstalled = typeof window !== "undefined" &&
                               window.phantom?.solana?.isPhantom;

    wallets.push({
      name: "Phantom",
      icon: "/Phantom_SVG_Icon.svg",
      adapter: phantomAdapter,
      readyState: isPhantomInstalled ? "Installed" : "NotDetected",
    });
  } catch (error) {
    console.error("Failed to initialize Phantom adapter:", error);
  }

  // Add Solflare wallet
  try {
    const solflareAdapter = new SolflareWalletAdapter();
    // Manually check if Solflare is installed
    const isSolflareInstalled = typeof window !== "undefined" &&
                                window.solflare?.isSolflare;

    wallets.push({
      name: "Solflare",
      icon: "/Solflare_INSIGNIA_Obsidian_Noir_BACKGROUND_Yellow.svg",
      adapter: solflareAdapter,
      readyState: isSolflareInstalled ? "Installed" : "NotDetected",
    });
  } catch (error) {
    console.error("Failed to initialize Solflare adapter:", error);
  }

  // Note: Wallet Standard detection removed due to SSR compatibility
  // Manually checking wallet installation status

  return wallets;
}

// Sort wallets by ready state
export function sortWalletsByReadyState(wallets: WalletConfig[]): WalletConfig[] {
  return wallets.sort((a, b) => {
    // Installed wallets first
    if (a.readyState === "Installed" && b.readyState !== "Installed") return -1;
    if (b.readyState === "Installed" && a.readyState !== "Installed") return 1;

    // Then loadable
    if (a.readyState === "Loadable" && b.readyState !== "Loadable") return -1;
    if (b.readyState === "Loadable" && a.readyState !== "Loadable") return 1;

    // Alphabetical for same ready state
    return a.name.localeCompare(b.name);
  });
}

// Get wallet ready state label
export function getReadyStateLabel(readyState: WalletReadyState): string {
  switch (readyState) {
    case "Installed":
      return "Detected";
    case "Loadable":
      return "Available";
    case "NotDetected":
      return "Install";
    case "Unsupported":
      return "Unsupported";
    default:
      return "Unknown";
  }
}