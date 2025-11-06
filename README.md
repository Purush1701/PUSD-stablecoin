# 💵 PUSD — Pegged USD Stablecoin

> **PUSD v1: Live on Sepolia with Uniswap pool**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.26-363636?logo=solidity)](https://soliditylang.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-5.0-4E5EE4?logo=openzeppelin)](https://openzeppelin.com/)
[![Network](https://img.shields.io/badge/Network-Sepolia-yellow)](https://sepolia.etherscan.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-grade ERC-20 stablecoin deployed on Ethereum Sepolia testnet with full Uniswap V4 integration. Built as a progressive learning journey from zero to a fully functional DeFi protocol.

---

## 🚀 Live Deployment

**Contract Address**: [`0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc`](https://sepolia.etherscan.io/address/0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc)

**Network**: Ethereum Sepolia Testnet  
**Total Supply**: 1,000,000 PUSD  
**Uniswap Pool**: PUSD/ETH Liquidity Pool Active ✅

---

## 📋 Features

### ✅ Version 1 (Current - LIVE)
- **ERC-20 Standard**: Full compliance with OpenZeppelin implementation
- **1M Token Supply**: Initial minting with controlled supply
- **Uniswap V4 Integration**: Active trading pool on Sepolia
- **Core Operations**:
  - ✓ Mint to clients
  - ✓ Trade PUSD/ETH on Uniswap
  - ✓ Add/remove liquidity
  - ✓ Transfer PUSD between wallets

### 🔄 Version 2 (In Development)
- `redeem()` function with token burn mechanism
- Event emission for transparency
- Enhanced user controls

### 🔮 Version 3 (Planned)
- Emergency `pause()` functionality
- Blacklist/whitelist mechanism
- Advanced compliance features

---

## 🏗️ Technology Stack

- **Smart Contract**: Solidity 0.8.26
- **Framework**: OpenZeppelin Contracts
- **Development Environment**: Remix IDE
- **Network**: Ethereum Sepolia
- **DEX**: Uniswap V4
- **Testing**: Remix Tests + Hardhat Console

---

## 📊 Version History

| Version | Features | Status | Contract Address |
|---------|----------|--------|------------------|
| **v1** | ERC-20, OpenZeppelin, 1M supply, Uniswap V4 pool | 🟢 LIVE | [`0x2c31...a75cc`](https://sepolia.etherscan.io/address/0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc) |
| **v2** | + `redeem()` with burn + event | 🟡 DEPLOYING | `TBA` |
| **v3** | + `pause()` + blacklist | 🔵 PLANNED | — |

---

## 🎯 Project Goals

This project demonstrates a complete journey of building a production-ready stablecoin from scratch:

1. ✅ Understanding ERC-20 token standards
2. ✅ Implementing secure smart contracts with OpenZeppelin
3. ✅ Deploying to Ethereum testnet
4. ✅ Integrating with Uniswap for liquidity
5. 🔄 Adding advanced DeFi features
6. 🔮 Implementing compliance and security controls

---

## 👨‍💻 Developer

**Purush** | Hong Kong Fintech  
🔧 QA Lead | Web3 Enthusiast | Automation Expert

**GitHub**: [@Purush1701](https://github.com/Purush1701)  
**LinkedIn**: [Purusothaman Navaneetha Krishnan](https://linkedin.com/in/purusothaman-navaneetha-krishnan-1311b845)

---

## 🧪 How to Interact

### Using Remix IDE
1. Open [Remix IDE](https://remix.ethereum.org/)
2. Import contract: `contracts/PUSD.sol`
3. Connect to Sepolia network via MetaMask
4. Load deployed contract at `0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc`

### Using Ethers.js
```javascript
import { ethers } from 'ethers';

const PUSD_ADDRESS = '0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc';
const provider = new ethers.JsonRpcProvider('SEPOLIA_RPC_URL');
const pusd = new ethers.Contract(PUSD_ADDRESS, ABI, provider);

// Check balance
const balance = await pusd.balanceOf(yourAddress);
```

### Trading on Uniswap
Visit [Uniswap Sepolia](https://app.uniswap.org/) and connect to Sepolia testnet to trade PUSD/ETH.

---

## 📁 Project Structure

```
PUSD-stablecoin/
├── contracts/
│   ├── PUSD.sol              # Main stablecoin contract
│   └── ...                   # Example contracts
├── scripts/
│   ├── deploy_with_ethers.ts # Ethers.js deployment
│   └── deploy_with_web3.ts   # Web3.js deployment
├── tests/
│   └── storage.test.js       # Contract tests
├── artifacts/                # Compiled contracts
└── README.md                 # This file
```

---

## 🔐 Security Considerations

- ✅ Built with audited OpenZeppelin contracts
- ✅ Deployed on testnet for thorough testing
- ⚠️ This is a testnet deployment - not for production use
- 🔮 Additional security features coming in v3

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

