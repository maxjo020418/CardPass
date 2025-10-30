// Solana chain IDs (CAIP-2 format)
const SOLANA_CHAINS = {
  mainnet: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
  devnet: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  testnet: "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ",
};

/**
 * Validates a Solana public key (address)
 * @param address - The Solana address to validate
 * @returns boolean indicating if the address is valid
 */
export function isValidSolanaAddress(address: string): boolean {
  // Solana addresses are base58 encoded and typically 32-44 characters
  if (!address || address.length < 32 || address.length > 44) {
    return false;
  }

  // Base58 character set for Solana
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(address);
}

/**
 * Formats a Solana address for display
 * @param address - The full Solana address
 * @param chars - Number of characters to show at start and end (default: 4)
 * @returns Formatted address like "7nDm...Hxg9"
 */
export function formatSolanaAddress(address: string, chars: number = 4): string {
  if (!address || address.length < chars * 2) {
    return address || "";
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Gets the Solana explorer URL for a given address or transaction
 * @param value - Address or transaction signature
 * @param type - Type of value ("address" | "tx")
 * @param network - Solana network ("mainnet" | "devnet" | "testnet")
 * @returns Explorer URL
 */
export function getSolanaExplorerUrl(
  value: string,
  type: "address" | "tx" = "address",
  network: "mainnet" | "devnet" | "testnet" = "mainnet"
): string {
  const cluster = network === "mainnet" ? "" : `?cluster=${network}`;
  return `https://explorer.solana.com/${type}/${value}${cluster}`;
}

/**
 * Gets the RPC endpoint for a given Solana network
 * @param network - Solana network
 * @returns RPC endpoint URL
 */
export function getSolanaRpcEndpoint(network: "mainnet" | "devnet" | "testnet" = "mainnet"): string {
  switch (network) {
    case "mainnet":
      return "https://api.mainnet-beta.solana.com";
    case "devnet":
      return "https://api.devnet.solana.com";
    case "testnet":
      return "https://api.testnet.solana.com";
    default:
      return "https://api.mainnet-beta.solana.com";
  }
}

/**
 * Converts lamports to SOL
 * @param lamports - Amount in lamports
 * @returns Amount in SOL
 */
export function lamportsToSol(lamports: number | string): number {
  const lamportsNum = typeof lamports === "string" ? parseInt(lamports, 10) : lamports;
  return lamportsNum / 1_000_000_000;
}

/**
 * Converts SOL to lamports
 * @param sol - Amount in SOL
 * @returns Amount in lamports
 */
export function solToLamports(sol: number | string): number {
  const solNum = typeof sol === "string" ? parseFloat(sol) : sol;
  return Math.floor(solNum * 1_000_000_000);
}

/**
 * Gets the chain ID for a given network
 * @param network - Solana network
 * @returns Chain ID in CAIP-2 format
 */
export function getSolanaChainId(network: "mainnet" | "devnet" | "testnet" = "mainnet"): string {
  return SOLANA_CHAINS[network];
}

/**
 * Parses a CAIP-10 account format
 * @param account - Account in format "solana:<chain_id>:<address>"
 * @returns Parsed components or null if invalid
 */
export function parseSolanaAccount(account: string): { network: string; address: string } | null {
  const parts = account.split(":");
  if (parts.length !== 3 || parts[0] !== "solana") {
    return null;
  }

  let network = "mainnet";
  switch (parts[1]) {
    case "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp":
      network = "mainnet";
      break;
    case "EtWTRABZaYq6iMfeYKouRu166VU2xqa1":
      network = "devnet";
      break;
    case "4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ":
      network = "testnet";
      break;
  }

  return {
    network,
    address: parts[2],
  };
}

/**
 * Creates a CAIP-10 account format for Solana
 * @param address - Solana address
 * @param network - Solana network
 * @returns Account in CAIP-10 format
 */
export function createSolanaAccount(address: string, network: "mainnet" | "devnet" | "testnet" = "mainnet"): string {
  const chainId = getSolanaChainId(network);
  return `${chainId}:${address}`;
}