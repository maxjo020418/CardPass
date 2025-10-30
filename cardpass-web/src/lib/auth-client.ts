import type { WalletAdapter } from "@solana/wallet-adapter-base";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ChallengeRequest {
  wallet: string;
  purpose?: string;
  domain?: string;
}

export interface ChallengeResponse {
  wallet: string;
  nonce: string;
  issued_at: string;
  expires_at: string;
  message: string;
}

export interface VerifyRequest {
  wallet: string;
  nonce: string;
  signature: string;
  signature_encoding?: string;
}

export interface VerifyResponse {
  ok: boolean;
  wallet: string;
  used_nonce: string;
  token?: string | null;
  token_expires_at?: string | null;
}

export interface MeResponse {
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  nonce: string;
  purpose: string;
  domain: string;
  aud?: string | null;
}

export class AuthClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async createChallenge(request: ChallengeRequest): Promise<ChallengeResponse> {
    const response = await fetch(`${this.baseUrl}/auth/challenge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to create challenge: ${response.statusText}`);
    }

    return response.json();
  }

  async verifyChallenge(request: VerifyRequest): Promise<VerifyResponse> {
    const response = await fetch(`${this.baseUrl}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to verify challenge: ${response.statusText}`);
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to logout: ${response.statusText}`);
    }
  }

  async me(): Promise<MeResponse> {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authenticated");
      }
      throw new Error(`Failed to get auth info: ${response.statusText}`);
    }

    return response.json();
  }
}

export async function signMessage(
  adapter: WalletAdapter,
  message: string
): Promise<Uint8Array> {
  if (!adapter.publicKey) {
    throw new Error("Wallet not connected");
  }

  if (!("signMessage" in adapter)) {
    throw new Error("Wallet does not support message signing");
  }

  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(message);

  const signature = await (adapter as any).signMessage(messageBytes);
  return signature;
}

export function encodeSignature(signature: Uint8Array, encoding: "base64" | "hex" = "base64"): string {
  if (encoding === "hex") {
    return Array.from(signature)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  return btoa(String.fromCharCode(...signature));
}