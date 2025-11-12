# PUSD Stablecoin dApp

A modern, user-friendly decentralized application (dApp) for managing PUSD (Pegged USD) stablecoin on the Ethereum Sepolia testnet. Built with React, TypeScript, and Web3 technologies, this application provides a complete interface for minting, transferring, burning, and managing the PUSD stablecoin.

## 🌟 Features

### Core Functionality

- **Wallet Connection**: Seamless MetaMask integration via RainbowKit
- **Balance & Supply Display**: Real-time view of your PUSD balance and total supply
- **Owner Minting**: Mint new PUSD tokens to any wallet address
- **Token Transfer**: Transfer PUSD tokens between wallets
- **Redeem/Burn**: Burn PUSD tokens with wire transfer settlement information
- **Token Management**: Pause/unpause contract functionality
- **Blacklist Management**: Add or remove wallets from the blacklist

### User Experience

- **Collapsible Sections**: Clean, organized UI with expandable action panels
- **Toast Notifications**: Industry-standard success (green), error (red), and info (amber) messages
- **Responsive Design**: Beautiful gradient UI optimized for all screen sizes
- **Real-time Updates**: Automatic data refresh after transactions
- **Transaction Confirmation**: Waits for blockchain confirmation before updating UI

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **MetaMask** browser extension (for wallet connection)
- **Sepolia ETH** (for gas fees on testnet)

## 🚀 Quick Start

### Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd PUSD-stablecoin/frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

4. **Open your browser**:
   The app will automatically open at `http://localhost:3000`

### First Time Setup

1. **Install MetaMask**: If you don't have MetaMask installed, download it from [metamask.io](https://metamask.io)

2. **Connect to Sepolia Testnet**:

   - Open MetaMask
   - Switch network to "Sepolia Testnet"
   - If Sepolia isn't available, add it manually:
     - Network Name: Sepolia
     - RPC URL: `https://eth-sepolia.g.alchemy.com/v2/demo`
     - Chain ID: 11155111
     - Currency Symbol: ETH

3. **Get Test ETH**: Visit a Sepolia faucet to get test ETH for gas fees

4. **Connect Wallet**: Click "Connect Wallet" in the dApp and approve the connection

## 🎯 Usage Guide

### Viewing Your Balance

- Your PUSD balance is displayed at the top of the page
- Total supply is shown alongside your balance
- Click the refresh icon (🔄) next to "Sepolia Testnet" to update both values

### Minting Tokens (Owner Only)

1. Click on **"Owner Mint"** section to expand it
2. Toggle **"Mint to connected wallet"** to automatically use your address, or enter a recipient address
3. Enter the amount to mint (e.g., `1000`)
4. Click **"Mint Tokens"**
5. Approve the transaction in MetaMask
6. Wait for confirmation - you'll see a success toast when complete

### Transferring Tokens

1. Click on **"Owner Transfer"** section to expand it
2. Enter the recipient wallet address
3. Enter the amount to transfer
4. Click **"Transfer Tokens"**
5. Approve and confirm the transaction in MetaMask

### Redeeming/Burning Tokens

1. Click on **"Redeem / Burn"** section to expand it
2. Enter the amount of PUSD you want to burn
3. Click **"Burn Tokens"**
4. Approve the transaction
5. You'll receive an info message explaining that the USD amount will be settled via wire transfer in 2-3 business days

### Token Management (Owner Only)

1. Click on **"Token Management"** section to expand it
2. **Pause/Unpause Contract**: Click the pause button to temporarily halt all transfers
3. **Blacklist Wallet**: Enter an address and click "Blacklist Wallet"
4. **Unblacklist Wallet**: Enter an address and click "Unblacklist Wallet"

## 🛠️ Configuration

### Contract Address

The PUSD contract address is configured in `src/config.ts`:

```typescript
export const PUSD_ADDRESS: Address =
  "0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5";
```

### Network & RPC

- **Network**: Ethereum Sepolia Testnet
- **RPC Endpoint**: Public Alchemy demo endpoint (configured in `src/index.tsx`)
- **Chain ID**: 11155111

### Project ID

The Reown (formerly WalletConnect) project ID is hardcoded in `src/index.tsx`. This is a public identifier used for wallet connections.

## 🏗️ Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   ├── manifest.json      # PWA manifest
│   └── ...
├── src/
│   ├── App.tsx            # Main application component
│   ├── config.ts          # Contract configuration (address & ABI)
│   ├── index.tsx          # Application entry point
│   ├── index.css         # Global styles with Tailwind CSS
│   ├── PUSD.json          # Contract ABI JSON
│   └── react-app-env.d.ts # TypeScript definitions
├── .vscode/               # VS Code settings (CSS validation)
├── postcss.config.js      # PostCSS configuration for Tailwind
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🧪 Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Configure build settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Deploy!

### Deploy to Other Platforms

The `build/` folder contains static files that can be deployed to:

- **Netlify**: Drag and drop the `build` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `build` folder contents
- **Any static hosting service**

## 🎨 Tech Stack

### Core Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Wagmi v2** - Ethereum React hooks
- **Viem** - Ethereum utilities
- **RainbowKit** - Wallet connection UI
- **TanStack Query** - Data fetching and caching

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Custom gradients** - Modern UI design

### Development Tools

- **Create React App** - Build tooling
- **PostCSS** - CSS processing
- **ESLint** - Code linting

## 🔧 Available Scripts

- `npm start` - Start development server (runs on port 3000)
- `npm run build` - Create production build
- `npm test` - Run tests (if test files exist)
- `npm run eject` - Eject from Create React App (irreversible)

## 📱 Features Breakdown

### Collapsible Sections

All action sections (Mint, Transfer, Burn, Token Management) are collapsed by default. Click the section header to expand and access the functionality.

### Toast Notifications

- **Green (Success)**: Successful transactions and operations
- **Red (Error)**: Transaction failures and validation errors
- **Amber (Info)**: Informational messages (e.g., burn settlement info)

### Contract Address Display

- Shows the PUSDv3 contract address with Ethereum symbol
- Clickable link to Etherscan for contract verification
- Copy-to-clipboard functionality

### Real-time Data

- Balance and supply update automatically after transactions
- Manual refresh available via icon next to "Sepolia Testnet"
- Transaction status tracked until blockchain confirmation

## 🔒 Security Notes

### Public Information (Safe to Share)

- **Contract Address**: Public on-chain data, visible to everyone
- **Project ID**: Public Reown identifier for wallet connections
- **RPC URL**: Public demo endpoint (testnet only)

### Never Share

- **Private Keys**: Never share your wallet's private key
- **Seed Phrases**: Keep your MetaMask seed phrase secure
- **API Keys**: If using private RPC endpoints, keep API keys secure

## 🐛 Troubleshooting

### Wallet Won't Connect

- Ensure MetaMask is installed and unlocked
- Check that you're on Sepolia testnet
- Try refreshing the page
- Clear browser cache if issues persist

### Transactions Failing

- Verify you have Sepolia ETH for gas fees
- Check that the contract isn't paused
- Ensure you have sufficient PUSD balance for transfers/burns
- Verify you're the contract owner for mint/pause/blacklist operations

### Build Errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear build cache: `rm -rf build node_modules/.cache`

### TypeScript Errors

- Ensure all dependencies are installed: `npm install`
- Check `tsconfig.json` is properly configured
- Restart your IDE/editor

## 📚 Additional Resources

- **Contract on Etherscan**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5)
- **Wagmi Documentation**: [wagmi.sh](https://wagmi.sh)
- **RainbowKit Docs**: [rainbowkit.com](https://www.rainbowkit.com)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

## 👤 Author

Built by **Purush**

- **GitHub**: [@Purush1701](https://github.com/Purush1701/PUSD-stablecoin)

## 📄 License

See root directory for license information.

---

**Note**: This is a testnet application. All transactions occur on Ethereum Sepolia testnet using test tokens. No real value is involved.
