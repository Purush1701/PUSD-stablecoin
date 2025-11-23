# 💵 PUSD — Pegged USD Stablecoin

> **PUSD v3: Production-Ready Stablecoin on Sepolia - Enterprise-Grade Compliance & Security**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue?style=flat-square)](https://soliditylang.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-5.0-4E5EE4?logo=openzeppelin)](https://openzeppelin.com/)
[![Hardhat](https://img.shields.io/badge/Hardhat-TypeScript-green?style=flat-square)](https://hardhat.org/)
![Tests](https://img.shields.io/badge/Tests-56%20Passing-brightgreen?style=flat-square)
![Audit](https://img.shields.io/badge/Audit-Remix%20100%25%20CLEAN-success?style=flat-square)
[![Slither](https://github.com/Purush1701/PUSD-stablecoin/workflows/Slither%20Security%20Analysis/badge.svg)](https://github.com/Purush1701/PUSD-stablecoin/actions/workflows/slither-analysis.yml)
[![Network](https://img.shields.io/badge/Network-Sepolia-blueviolet?style=flat-square)](https://sepolia.etherscan.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-grade ERC-20 stablecoin on Ethereum Sepolia with comprehensive compliance features, emergency controls, and enterprise-level security. Built with OpenZeppelin v5 and designed to meet HK regulated custodian standards.

---

## 🚀 Live Deployment

**PUSD v3**: [`0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5`](https://sepolia.etherscan.io/address/0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5) ⭐

**Network**: Ethereum Sepolia Testnet  
**Initial Supply**: 1,000,000 PUSD  
**Max Supply**: 100,000,000 PUSD (100M cap)

---

## ✨ PUSD v3 Features

### 🔐 Core ERC-20 Functionality

- **Full ERC-20 Compliance**: OpenZeppelin v5 implementation
- **6 Decimal Precision**: Optimized for stablecoin operations
- **Initial Supply**: 1M tokens minted on deployment
- **Standard Operations**: Transfer, approve, transferFrom

### 💰 Token Management

- **Minting**: Owner-controlled token creation with max supply enforcement
- **Redeem & Burn**: Multi-currency redemption with automatic token burning
- **Max Supply Cap**: Hard limit of 100M PUSD to prevent inflation
- **Event Emissions**: Comprehensive event logging for off-chain tracking

### 🛡️ Security & Compliance

- **Emergency Pause**: Owner can pause/unpause all token operations
- **Blacklist System**: Block malicious addresses (SFC/HKMA compliance)
- **Access Control**: Owner-only functions with OpenZeppelin Ownable
- **Pause Protection**: All transfers, mints, and redeems blocked when paused
- **Blacklist Enforcement**: Blocks transfers from/to blacklisted addresses

### 🧪 Testing & Quality

- **56 Comprehensive Tests**: Unit + integration test coverage
- **Sepolia Integration Tests**: Real network validation
- **Edge Case Coverage**: Zero transfers, multiple pause cycles, ownership transfers
- **Negative Testing**: Access control, paused state, blacklist scenarios

### 🔍 Security Analysis

- **Slither Clean**: Automated static analysis on every push/PR
- **Zero Tolerance**: Build fails on High/Medium severity findings
- **CI/CD Integration**: Automated security scanning in GitHub Actions
- **Compliance Ready**: Meets HK regulated custodian security standards

---

## 🏗️ Technology Stack

- **Smart Contract**: Solidity 0.8.20
- **Framework**: OpenZeppelin Contracts 5.0
- **Development**: Hardhat + TypeScript
- **Testing**: Mocha + Chai (56 tests)
- **Type Safety**: TypeChain auto-generated types
- **Network**: Ethereum Sepolia + Local Hardhat
- **Security**: Slither static analysis

---

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/Purush1701/PUSD-stablecoin.git
cd PUSD-stablecoin

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test
```

### Development Commands

```bash
# Testing
npm test                    # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests on Sepolia

# Deployment
npm run deploy:v3:local    # Deploy to local Hardhat network
npm run deploy:v3:sepolia  # Deploy to Sepolia testnet

# Interaction
npm run interact:sepolia   # Interact with deployed contract
npm run console            # Hardhat console

# Security
npm run security:slither   # Run Slither analysis locally
```

### Example Usage

```typescript
import { ethers } from "hardhat";

// Connect to deployed contract
const pusdv3 = await ethers.getContractAt(
  "PUSDv3",
  "0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5"
);

// Owner functions
await pusdv3.mint(userAddress, ethers.parseUnits("1000", 6));
await pusdv3.pause();
await pusdv3.blacklist(maliciousAddress);
await pusdv3.unblacklist(address);

// User functions
await pusdv3.transfer(recipient, ethers.parseUnits("100", 6));
await pusdv3.redeem(ethers.parseUnits("50", 6), "USD");
```

---

## 📁 Project Structure

```
PUSD-stablecoin/
├── contracts/
│   ├── PUSD.sol          # v1: Basic ERC-20
│   ├── PUSDv2.sol        # v2: + Redeem
│   └── PUSDv3.sol        # v3: + Pause + Blacklist ⭐
├── scripts/
│   ├── deploy-v3.ts      # Deployment script
│   ├── interact-sepolia.ts
│   └── fund-wallets.ts
├── test/
│   ├── PUSDv3.unit.test.ts
│   ├── PUSDv3.integration.test.ts
│   └── fixtures/
├── .github/workflows/
│   └── slither-analysis.yml  # Security CI/CD
├── audit/                # Security reports
└── docs/                 # Documentation
```

---

## 🔐 Security

### Security Features

- ✅ Audited OpenZeppelin Contracts v5.0
- ✅ 56 comprehensive tests (unit + integration)
- ✅ Emergency pause/unpause controls
- ✅ Blacklist functionality for compliance
- ✅ Max supply cap enforcement
- ✅ Automated Slither static analysis
- ✅ Zero tolerance for High/Medium findings

### Slither Clean Status

This project maintains **Slither clean** status with automated static analysis on every push and pull request.

- **Latest Report**: [View on GitHub Actions](https://github.com/Purush1701/PUSD-stablecoin/actions/workflows/slither-analysis.yml)
- **Run Locally**: `npm run security:slither`
- **CI/CD**: Automated scanning with artifact retention (90 days)

The workflow enforces zero tolerance for High or Medium severity findings, ensuring production-ready security standards expected by HK regulated custodians.

### Security Considerations

- ⚠️ **Testnet Deployment**: Not audited for mainnet use
- 🔒 **Production**: Consider professional audit before mainnet deployment

---

## 📊 Version History

### Current Version: v3 (LIVE)

**Contract**: [`0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5`](https://sepolia.etherscan.io/address/0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5)

**Features**:

- All v2 features (ERC-20, mint, redeem, multi-currency)
- Emergency pause/unpause
- Blacklist/unblacklist system
- Max supply cap (100M PUSD)
- 56 comprehensive tests
- Slither clean status

### Previous Versions

#### Version 2 (Deprecated)

**Contract**: [`0x251C...e622`](https://sepolia.etherscan.io/address/0x251C3d4b2F2FB744f2fFd179C4C455c2620fe622)

- ERC-20 standard
- Redeem function with burn
- Multi-currency support
- Event emissions

#### Version 1 (Deprecated)

**Contract**: [`0x2c31...a75cc`](https://sepolia.etherscan.io/address/0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc)

- Basic ERC-20 implementation
- OpenZeppelin contracts
- 1M initial supply
- Uniswap V4 integration

---

## 🎯 Project Goals

This project demonstrates building a production-ready stablecoin:

1. ✅ ERC-20 token standard implementation
2. ✅ Secure smart contracts with OpenZeppelin
3. ✅ Testnet deployment and verification
4. ✅ Comprehensive testing (56 tests)
5. ✅ Compliance features (pause, blacklist)
6. ✅ Professional TypeScript + Hardhat setup
7. ✅ Automated security analysis (Slither)
8. ✅ CI/CD integration

---

## 👨‍💻 Developer

**Purush** | Hong Kong Fintech  
🔧 QA Lead | Web3 Enthusiast | Automation Expert

**GitHub**: [@Purush1701](https://github.com/Purush1701)  
**LinkedIn**: [Purusothaman Navaneetha Krishnan](https://linkedin.com/in/purusothaman-navaneetha-krishnan-1311b845)

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
