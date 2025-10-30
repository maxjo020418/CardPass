# CardPass

**"Contact costs, referrals reward."**

A Solana-based professional networking platform using compressed NFT business cards with spam-resistant contact requests and automated referral rewards.

## Core Features

- **Contact Gate**: Pay to contact professionals, preventing spam while compensating for their time
- **Intro Rewards**: Earn rewards for successful referrals through automated escrow distribution
- **cNFT Business Cards**: Low-cost, verifiable digital business cards on Solana

## How It Works

1. **Create Profile**: Connect wallet → mint business card cNFT → set contact price
2. **Contact Requests**: Recruiters deposit USDC to unlock contact info (refunded if replied within 24h)
3. **Job Referrals**: Create referral links for job postings → earn bounties when candidates get hired

---

## Development

This is a SolidStart project, powered by [`solid-start`](https://start.solidjs.com).

### Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

### Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

Solid apps are built with _presets_, which optimise your project for deployment to different environments. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

---

## Project Structure

- `/src/routes` - Page components and API routes
- `/src/components` - Reusable UI components  
- `/src/lib` - Utilities and Solana integration
- `/public` - Static assets

---

This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
