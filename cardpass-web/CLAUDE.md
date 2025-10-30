# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CardPass is a Solana-based professional networking platform built with SolidStart. The application features:
- Contact Gate: Spam-resistant contact requests with deposit/refund mechanism
- Intro Rewards: Automated referral bounties through escrow distribution
- cNFT Business Cards: Compressed NFT-based digital business cards
- Internationalization: Full Korean and English language support

## Development Commands

### Core Commands
- `pnpm dev` - Start development server (uses Vinxi)
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Package Management
This project uses pnpm (version 10.16.1+). Use `pnpm install` for dependency management.

### Node Version
Requires Node.js >= 22

## Architecture

### Framework & Routing
- **SolidStart**: Meta-framework built on SolidJS
- **File-based routing**: Routes defined in `src/routes/` directory
- **Router**: Uses `@solidjs/router` with FileRoutes for automatic route discovery
- **App structure**: Main App component in `src/app.tsx` with global Nav and Suspense wrapper

### Internationalization (i18n)
- **Library**: `@solid-primitives/i18n` for translations
- **Languages**: Korean (ko) and English (en)
- **Translation files**: Located in `src/constants/i18n/`
- **Context Provider**: `I18nProvider` wraps the app for global language state

### Styling
- **TailwindCSS v4**: Configured via `@tailwindcss/vite` plugin
- **CSS**: Global styles in `src/styles/app.css`
- **Font**: Pretendard font family for better Korean/English typography

### Deployment
- **Target**: Cloudflare Workers (cloudflare_module preset)
- **Config**: Defined in `app.config.ts` with Cloudflare-specific settings

### Project Structure
```
src/
├── app/                    # Application configuration (reserved for future use)
├── components/
│   ├── ui/                # UI components (LanguageSwitcher.tsx)
│   ├── layout/            # Layout components (Nav.tsx)
│   └── shared/            # Shared/common components
├── features/
│   ├── auth/              # Authentication features
│   └── dashboard/         # Dashboard features
├── constants/
│   └── i18n/             # Translation dictionaries (en.ts, ko.ts)
├── contexts/             # React contexts (i18n.tsx)
├── hooks/                # Custom hooks
├── lib/                  # Third-party library wrappers
├── routes/               # Page routes (index.tsx, jobs.tsx, about.tsx, [...404].tsx)
├── store/                # Global state management
├── styles/               # CSS and style files (app.css)
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── app.tsx              # Root App component with Router setup
├── entry-client.tsx     # Client-side entry point
└── entry-server.tsx     # Server-side entry point
```

### Key Patterns
- **Path aliases**: `~/*` maps to `./src/*` for clean imports
- **JSX**: SolidJS JSX with preserve mode, no React imports needed
- **TypeScript**: Strict mode enabled with ESNext target
- **Components**: Functional components using SolidJS primitives
- **Reactive patterns**: Functions for reactive data (e.g., `const items = () => [...]`)

## Development Notes

### Code Style Guidelines
- **ALWAYS** use SolidJS control flow components (`<Show>`, `<For>`, `<Switch>`) instead of JS conditionals
- **ALWAYS** use reactive primitives for state that changes
- **NEVER** destructure props - access them directly to maintain reactivity
- **PREFER** `createMemo` over inline computations for derived state
- **PREFER** `createStore` for complex objects over multiple signals
- **USE** `batch()` when updating multiple signals at once

### SolidJS Best Practices - IMPORTANT

#### Core Reactivity Primitives
- **createSignal**: For reactive state management
  ```tsx
  const [count, setCount] = createSignal(0);
  ```
- **createEffect**: For side effects that re-run when dependencies change
  ```tsx
  createEffect(() => console.log("Count changed:", count()));
  ```
- **createMemo**: For computed values with automatic memoization
  ```tsx
  const doubled = createMemo(() => count() * 2);
  ```
- **createResource**: For async data fetching
  ```tsx
  const [data] = createResource(userId, fetchUser);
  ```
- **createStore**: For complex reactive state objects
  ```tsx
  const [state, setState] = createStore({ user: null, isLoading: false });
  ```

#### Control Flow Components - ALWAYS USE THESE
- **<Show>**: Conditional rendering (preferred over ternary)
  ```tsx
  <Show when={isLoggedIn()} fallback={<LoginButton />}>
    <Dashboard />
  </Show>
  ```
- **<For>**: List rendering with automatic keying
  ```tsx
  <For each={items()}>{(item, index) =>
    <ListItem item={item} index={index()} />
  }</For>
  ```
- **<Switch>/<Match>**: Multiple conditional branches
  ```tsx
  <Switch>
    <Match when={state() === "loading"}><Spinner /></Match>
    <Match when={state() === "error"}><Error /></Match>
    <Match when={state() === "success"}><Success /></Match>
  </Switch>
  ```
- **<Index>**: For primitive arrays where item identity doesn't matter
- **<ErrorBoundary>**: Error handling in component trees
- **<Suspense>**: Loading states for async components
- **<Portal>**: Render outside component hierarchy

#### Additional Primitives
- **onMount**: Component lifecycle hook
- **onCleanup**: Cleanup function for effects
- **batch**: Batch multiple updates
- **untrack**: Opt out of tracking

#### Key Differences from React
- No virtual DOM - direct DOM manipulation
- Components run once - use reactive primitives for updates
- No hooks rules - can use conditionals
- Fine-grained reactivity - only what's needed updates
- `<A>` component for client-side navigation instead of `<a>`
- `class` instead of `className`
- Arrays and objects should be wrapped in functions for reactivity

### Internationalization Best Practices
- Always use the `t()` function for text content
- Make data reactive by using `createMemo` or functions
- Avoid hardcoding language-specific content
- Use flattened dictionaries for better performance

### Styling Conventions
- Utility-first approach with TailwindCSS
- Responsive prefixes (sm:, md:, lg:)
- Component-scoped classes using `class` attribute (not `className`)
- Dark theme with gradient accents (violet/cyan)
- Consistent spacing and rounded corners (rounded-xl, rounded-2xl)

## Wallet Integration

### Solana Wallet Adapter
- **Library**: `@solana/wallet-adapter-base` for wallet connections
- **Supported Wallets**: Phantom, Solflare (manually configured)
- **Wallet Standard**: Not used due to SSR compatibility issues
- **Architecture**: Direct adapter usage without intermediate libraries

#### Wallet Manager (`src/lib/wallet-manager.ts`)
- Initializes wallet adapters only on client side (`typeof window !== "undefined")
- Returns empty array on SSR to prevent hydration mismatches
- Manually configures Phantom and Solflare adapters
- Sorts wallets by ready state (Installed > Loadable > NotDetected)

#### Wallet Store (`src/store/wallet.ts`)
- Uses SolidJS `createStore` for reactive state management
- Handles wallet connection/disconnection
- Manages modal visibility
- Sets up event listeners for wallet events

#### Key Implementation Details
- **SSR Safety**: Always check `typeof window === "undefined"` before accessing browser APIs
- **Hydration**: Ensure server and client render identical initial HTML
- **Event Cleanup**: Use `onCleanup()` to remove event listeners
- **Error Handling**: Gracefully handle connection failures

### Wallet UI Components
- **WalletModal**: Custom modal using SolidJS Portal
- **SolanaWalletButton**: Connection button with state display
- Uses `<Show>` and `<For>` for conditional rendering
- Reactive state updates via signals and stores
