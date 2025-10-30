import { Show, onMount, createEffect, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import {
  walletState,
  initializeWallet,
  disconnectWallet,
  openWalletModal,
  closeWalletModal,
  connectWallet,
} from "~/store/wallet";
import WalletModal from "~/components/ui/WalletModal";
import { formatSolanaAddress } from "~/utils/solana";
import type { WalletConfig } from "~/lib/wallet-manager";
import { useI18n } from "~/contexts/i18n";

export default function SolanaWalletButton() {
  const { t, locale } = useI18n();
  const [showDropdown, setShowDropdown] = createSignal(false);

  onMount(() => {
    initializeWallet();
  });

  const handleConnect = () => {
    openWalletModal();
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const handleWalletSelect = async (wallet: WalletConfig) => {
    try {
      await connectWallet(wallet);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      // Close the modal if there was an error
      closeWalletModal();
    }
  };

  return (
    <>
      <Show
        when={walletState.isAuthenticated && walletState.publicKey}
        fallback={
          <button
            onClick={handleConnect}
            disabled={!walletState.isInitialized || walletState.isConnecting}
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
          >
            <Show
              when={!walletState.isConnecting}
              fallback={
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </Show>
            <span>
              <Show when={walletState.isConnecting} fallback="Connect Wallet">
                Connecting...
              </Show>
            </span>
          </button>
        }
      >
        <div class="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown())}
            class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center text-white text-sm font-bold">
              {walletState.publicKey?.toString().charAt(0).toUpperCase()}
            </div>
            <div class="flex flex-col items-start">
              <span class="text-sm text-gray-300">
                {formatSolanaAddress(walletState.publicKey || "", 4)}
              </span>
              <span class="text-xs text-gray-500">
                <Show
                  when={walletState.isConnected && walletState.walletName}
                  fallback="Connected"
                >
                  {walletState.walletName}
                </Show>
              </span>
            </div>
            <svg
              class={`w-4 h-4 text-gray-400 transition-transform ${
                showDropdown() ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <Show when={showDropdown()}>
            <div class="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
              {/* User Info */}
              <div class="px-4 py-3 border-b border-gray-800">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                    {walletState.publicKey?.toString().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p class="text-sm text-white font-medium">
                      {formatSolanaAddress(walletState.publicKey || "", 4)}
                    </p>
                    <p class="text-xs text-gray-400">
                      {walletState.walletName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div class="py-2">
                <A
                  href="/dashboard"
                  onClick={() => setShowDropdown(false)}
                  class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>{locale() === "ko" ? "대시보드" : "Dashboard"}</span>
                </A>

                <A
                  href="/me"
                  onClick={() => setShowDropdown(false)}
                  class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{locale() === "ko" ? "프로필 설정" : "Profile Settings"}</span>
                </A>

                <A
                  href="/me/monetization"
                  onClick={() => setShowDropdown(false)}
                  class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{locale() === "ko" ? "레쥬메 수익화" : "Resume Monetization"}</span>
                </A>

                <A
                  href="/jobs/new"
                  onClick={() => setShowDropdown(false)}
                  class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{locale() === "ko" ? "채용 공고 등록" : "Post a Job"}</span>
                </A>
              </div>

              {/* Divider */}
              <div class="border-t border-gray-800">
                <Show when={!walletState.isConnected}>
                  <button
                    onClick={() => {
                      handleConnect();
                      setShowDropdown(false);
                    }}
                    class="flex items-center gap-3 px-4 py-2 text-violet-400 hover:text-violet-300 hover:bg-gray-800 transition-colors w-full"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>{locale() === "ko" ? "지갑 재연결" : "Reconnect Wallet"}</span>
                  </button>
                </Show>

                <button
                  onClick={() => {
                    handleDisconnect();
                    setShowDropdown(false);
                  }}
                  class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-colors w-full"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{locale() === "ko" ? "로그아웃" : "Logout"}</span>
                </button>
              </div>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={walletState.authError}>
        <div class="absolute top-16 right-0 mt-2 p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-200 max-w-xs">
          Authentication failed: {walletState.authError}
        </div>
      </Show>

      <WalletModal
        isOpen={walletState.isModalOpen}
        wallets={walletState.wallets}
        onClose={closeWalletModal}
        onSelect={handleWalletSelect}
      />
    </>
  );
}