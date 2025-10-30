import { Show, For, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import type { WalletConfig } from "~/lib/wallet-manager";
import { getReadyStateLabel } from "~/lib/wallet-manager";

interface WalletModalProps {
  isOpen: boolean;
  wallets: WalletConfig[];
  onClose: () => void;
  onSelect: (wallet: WalletConfig) => void;
}

export default function WalletModal(props: WalletModalProps) {
  const [isConnecting, setIsConnecting] = createSignal<string | null>(null);

  // Close modal on escape key
  createEffect(() => {
    if (props.isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          props.onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  });

  const handleWalletClick = async (wallet: WalletConfig) => {
    // If wallet is not installed, open the installation page instead
    if (wallet.readyState === "NotDetected") {
      if (wallet.name === "Phantom") {
        window.open("https://phantom.app/download", "_blank");
      } else if (wallet.name === "Solflare") {
        window.open("https://solflare.com/download", "_blank");
      }
      return;
    }

    try {
      setIsConnecting(wallet.name);
      await props.onSelect(wallet);
    } catch (error) {
      console.error(`Failed to connect to ${wallet.name}:`, error);
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <Portal>
      <Show when={props.isOpen}>
        <div
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              props.onClose();
            }
          }}
        >
          <div
            class="bg-gray-900 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white">Connect Wallet</h2>
              <button
                onClick={props.onClose}
                class="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="space-y-3">
              <Show
                when={props.wallets.length > 0}
                fallback={
                  <div class="text-center py-8">
                    <p class="text-gray-400">No wallets detected</p>
                    <p class="text-sm text-gray-500 mt-2">
                      Please install a Solana wallet extension
                    </p>
                  </div>
                }
              >
                <For each={props.wallets}>
                  {(wallet) => (
                    <button
                      onClick={() => handleWalletClick(wallet)}
                      disabled={isConnecting() !== null}
                      class="w-full p-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex items-center justify-between group"
                    >
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                          <Show
                            when={wallet.icon.startsWith("/")}
                            fallback={
                              <img
                                src={wallet.icon}
                                alt={wallet.name}
                                class="w-6 h-6"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            }
                          >
                            <img
                              src={wallet.icon}
                              alt={wallet.name}
                              class="w-6 h-6"
                            />
                          </Show>
                        </div>
                        <div class="text-left">
                          <p class="text-white font-medium">{wallet.name}</p>
                          <p class="text-xs text-gray-400">
                            {getReadyStateLabel(wallet.readyState)}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <Show when={isConnecting() === wallet.name}>
                          <div class="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                        </Show>
                        <Show when={wallet.readyState === "Installed"}>
                          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        </Show>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-gray-400 group-hover:text-white transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  )}
                </For>
              </Show>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-800">
              <p class="text-xs text-gray-500 text-center">
                By connecting a wallet, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </Show>
    </Portal>
  );
}