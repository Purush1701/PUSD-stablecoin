# 💵 PUSD — Pegged USD Stablecoin

> **PUSD v3: Live on Sepolia - Mint, Redeem, Pause & Blacklist**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue?style=flat-square)](https://soliditylang.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-5.0-4E5EE4?logo=openzeppelin)](https://openzeppelin.com/)
[![Hardhat](https://img.shields.io/badge/Hardhat-TypeScript-green?style=flat-square)](https://hardhat.org/)
![Tests](https://img.shields.io/badge/Tests-44%20Passing-brightgreen?style=flat-square)
![Audit](https://img.shields.io/badge/Audit-Remix%20100%25%20CLEAN-success?style=flat-square)
[![Network](https://img.shields.io/badge/Network-Sepolia-blueviolet?style=flat-square)](https://sepolia.etherscan.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-grade ERC-20 stablecoin on Ethereum Sepolia with pause, blacklist, and redeem capabilities. Progressive journey from basic token (v1) to enterprise-grade compliance features (v3).

---

## 🚀 Live Deployments

**PUSD v3**: [`0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5`](https://sepolia.etherscan.io/address/0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5) ⭐ **Current**
**PUSD v2**: [`0x251C3d4b2F2FB744f2fFd179C4C455c2620fe622`](https://sepolia.etherscan.io/address/
0x251C3d4b2F2FB744f2fFd179C4C455c2620fe622)  
**PUSD v1**: [`0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc`](https://sepolia.etherscan.io/address/
0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc)

**Network**: Ethereum Sepolia Testnet  
**Total Supply**: 1,000,000 PUSD each  
**Uniswap Pool**: v1 PUSD/ETH Active ✅

---

## 📋 Features

### ✅ Version 1 (LIVE)

- **ERC-20 Standard**: Full compliance with OpenZeppelin implementation
- **1M Token Supply**: Initial minting with controlled supply
- **Uniswap V4 Integration**: Active trading pool on Sepolia
- **Core Operations**:
  - ✓ Mint to clients
  - ✓ Trade PUSD/ETH on Uniswap
  - ✓ Add/remove liquidity
  - ✓ Transfer PUSD between wallets

### ✅ Version 2 (LIVE)

- **Redeem Function**: Burn PUSD tokens with `redeem()`
- **Multi-Currency Support**: USD, EUR, GBP, etc.
- **Event Emission**: `Redeemed` event for off-chain tracking
- **Full Test Coverage**: 22 comprehensive tests
- **TypeScript Ready**: Deploy scripts and interaction tools

### ✅ Version 3 (Current - LIVE)

- **Pause/Unpause**: Emergency pause functionality
- **Blacklist**: Block malicious addresses (SFC/HKMA compliance)
- **Max Supply Cap**: 100M PUSD hard limit
- **Full Test Coverage**: 44 comprehensive tests
- **All v2 Features**: Includes redeem/burn - `redeem()` blocked when paused/blacklisted

---

## 🏗️ Technology Stack

- **Smart Contract**: Solidity 0.8.20
- **Framework**: OpenZeppelin Contracts 5.0
- **Development**: Hardhat + TypeScript
- **Testing**: Mocha + Chai (81 tests)
- **Type Safety**: TypeChain auto-generated types
- **Network**: Ethereum Sepolia + Local Hardhat
- **DEX**: Uniswap V4

---

## 📊 Version History

| Version | Features                                         | Status  | Contract Address                                                                                    |
| ------- | ------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------- |
| **v1**  | ERC-20, OpenZeppelin, 1M supply, Uniswap V4 pool | 🟢 LIVE | [`0x2c31...a75cc`](https://sepolia.etherscan.io/address/0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc) |
| **v2**  | + `redeem()` with burn + multi-currency + events | 🟢 LIVE | [`0x251C...e622`](https://sepolia.etherscan.io/address/0x251C3d4b2F2FB744f2fFd179C4C455c2620fe622)  |
| **v3**  | + `pause()` + blacklist + max supply cap         | 🟢 LIVE | [`0xc88a...07b9`](https://sepolia.etherscan.io/address/0xc88a47790A74D0a72e6234cB96FC54fA632607b9)  |

---

## 🎯 Project Goals

This project demonstrates a complete journey of building a production-ready stablecoin from scratch:

1. ✅ Understanding ERC-20 token standards
2. ✅ Implementing secure smart contracts with OpenZeppelin
3. ✅ Deploying to Ethereum testnet
4. ✅ Integrating with Uniswap for liquidity
5. ✅ Adding redeem/burn functionality
6. ✅ Professional TypeScript + Hardhat setup
7. ✅ Comprehensive test coverage (81 tests)
8. ✅ Implemented pause and compliance controls (v3)

---

## 👨‍💻 Developer

**Purush** | Hong Kong Fintech  
🔧 QA Lead | Web3 Enthusiast | Automation Expert

**GitHub**: [@Purush1701](https://github.com/Purush1701)  
**LinkedIn**: [Purusothaman Navaneetha Krishnan](https://linkedin.com/in/purusothaman-navaneetha-krishnan-1311b845)

---

## 🛠️ Development Setup

This project supports **both** Remix IDE and local development:

### 🌐 Option 1: Remix IDE (Browser-based)

Perfect for quick experiments and demonstrations. All contracts are Remix-compatible.

### 💻 Option 2: Local Development with Hardhat

Professional development environment with comprehensive testing, deployment automation, and CI/CD integration.

**Quick Start:**

```bash
npm install
npm run compile
npm test
```

📖 **Full Setup Guide**: See [SETUP.md](./SETUP.md) for detailed instructions on local development, testing, and deployment.

---

## 🧪 How to Use

### Local Development

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run all tests (v1 + v2 + v3)
npm test

# Run specific version tests
npm run test:v2
npm run test:v3

# Start local blockchain
npm run node

# Deploy locally
npm run deploy:local        # v1
npm run deploy:v2:local     # v2
npm run deploy:v3:local     # v3

# Interactive console
npx hardhat console --network localhost
```

### Deploy to Sepolia

```bash
# Deploy specific version
npm run deploy:sepolia          # v1
npm run deploy:v2:sepolia       # v2
npm run deploy:v3:sepolia       # v3
```

### Interact with Deployed Contracts

```bash
# Interact with Sepolia deployment
npm run interact:sepolia

# Or use console
npx hardhat console --network sepolia
```

### Example: Use v3 Features

```typescript
// Connect to v3 contract
const pusdv3 = await ethers.getContractAt(
  "PUSDv3",
  "0xc88a47790A74D0a72e6234cB96FC54fA632607b9"
);

// Pause contract (owner only)
await pusdv3.pause();

// Blacklist address (owner only)
await pusdv3.blacklist(maliciousAddress);

// Redeem 100 PUSD for USD (burns tokens)
await pusdv3.redeem(ethers.parseUnits("100", 6), "USD");
```

---

## 📁 Project Structure

```
PUSD-stablecoin/
├── contracts/
│   ├── PUSD.sol              # v1: Basic stablecoin
│   ├── PUSDv2.sol            # v2: + Redeem function
│   └── PUSDv3.sol            # v3: + Pause + Blacklist
├── scripts/
│   ├── deploy.ts             # Deploy v1
│   ├── deploy-v2.ts          # Deploy v2
│   ├── deploy-v3.ts          # Deploy v3
│   └── interact.ts           # Interact with deployed contracts
├── test/
│   ├── PUSD.test.ts          # v1 tests (15 tests)
│   ├── PUSDv2.test.ts        # v2 tests (22 tests)
│   └── PUSDv3.test.ts        # v3 tests (44 tests)
├── docs/
│   ├── HARDHAT_CONSOLE_Ref.md    # Console guide
│   └── COMMANDS_QUICK_Ref.md     # Quick reference
├── typechain-types/          # Auto-generated TypeScript types
├── artifacts/                # Compiled contracts
├── hardhat.config.ts         # Hardhat configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

---

## 🔐 Security Considerations

- ✅ Built with audited OpenZeppelin contracts v5.0
- ✅ Comprehensive test coverage (81 tests passing)
- ✅ Pause/unpause emergency controls (v3)
- ✅ Blacklist functionality for compliance (v3)
- ✅ Max supply cap to prevent inflation (v3)
- ⚠️ Testnet deployment - not audited for mainnet use
- 🔒 Consider professional audit before production

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure contract libraries
- [Uniswap](https://uniswap.org/) for DEX integration
- [Ethereum](https://ethereum.org/) for the robust blockchain platform

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ for the Web3 community

[Report Bug](https://github.com/Purush1701/PUSD-stablecoin/issues) · [Request Feature](https://github.com/Purush1701/PUSD-stablecoin/issues)

</div>
