# 🚀 PUSD Development Commands Cheat Sheet

## 📋 Quick Reference

### ⚡ Most Used Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Test with gas report
npm run test:gas

# Deploy to Sepolia
npm run deploy:sepolia

# Interact with deployed contract
npm run interact:sepolia
```

---

## 🔨 Development Workflow

### 1️⃣ Start Local Blockchain
```bash
# Terminal 1 - Start node
npm run node

# Gives you:
# - 20 accounts with 10,000 ETH each
# - Instant mining (no wait time)
# - Free to use
```

### 2️⃣ Deploy Locally
```bash
# Terminal 2 - Deploy
npm run deploy:local

# Test everything before spending real ETH!
```

### 3️⃣ Interactive Console
```bash
# Connect to local or Sepolia
npx hardhat console --network localhost
npx hardhat console --network sepolia

# Inside console:
const PUSD = await ethers.getContractFactory("PUSD");
const pusd = PUSD.attach("0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc");
await pusd.name()
await pusd.balanceOf("0xYourAddress")
await pusd.totalSupply()
```

---

## 🧪 Testing Commands

### Run All Tests
```bash
npm test
```

### Run Specific Test
```bash
npx hardhat test --grep "transfer"
npx hardhat test --grep "Minting"
```

### Test with Gas Reporting
```bash
npm run test:gas
```

### Test with Stack Traces
```bash
npx hardhat test --verbose
```

---

## 🌍 Network Commands

### Local Development
```bash
# Start local blockchain
npm run node

# Deploy to local
npm run deploy:local

# Console on local
npx hardhat console --network localhost
```

### Sepolia Testnet
```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Interact with Sepolia
npm run interact:sepolia

# Console on Sepolia
npx hardhat console --network sepolia

# Run specific script
npx hardhat run scripts/YOUR_SCRIPT.ts --network sepolia
```

---

## 📝 Writing New Scripts

### Create New Script
```typescript
// scripts/my-script.ts
import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const pusd = await ethers.getContractAt(
    "PUSD", 
    "0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc"
  );
  
  // Your logic here
  const balance = await pusd.balanceOf(signer.address);
  console.log("Balance:", ethers.formatUnits(balance, 6));
}

main();
```

### Run Your Script
```bash
# Local
npx hardhat run scripts/my-script.ts --network localhost

# Sepolia
npx hardhat run scripts/my-script.ts --network sepolia
```

---

## 🔍 Verification & Inspection

### Verify on Etherscan
```bash
# Manual verification
npx hardhat verify --network sepolia 0xYourContractAddress

# Automatically done in deploy script! ✅
```

### Check Compilation
```bash
# Compile and generate types
npm run compile

# Clean and recompile
npm run clean && npm run compile
```

---

## 💰 Gas & Optimization

### Gas Report
```bash
REPORT_GAS=true npm test
```

### Optimize Contract
Edit `hardhat.config.ts`:
```typescript
solidity: {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,  // Increase for more optimization
    },
  },
}
```

---

## 📦 Common Operations

### Get Contract Info
```bash
npx hardhat console --network sepolia
```
```javascript
const pusd = await ethers.getContractAt("PUSD", "0x2c31...");
await pusd.name()           // Name
await pusd.symbol()         // Symbol
await pusd.decimals()       // Decimals
await pusd.totalSupply()    // Total supply
await pusd.owner()          // Owner address
```

### Transfer Tokens
```javascript
const amount = ethers.parseUnits("100", 6);
const tx = await pusd.transfer("0xRecipient", amount);
await tx.wait();
```

### Mint Tokens (Owner Only)
```javascript
const amount = ethers.parseUnits("1000", 6);
const tx = await pusd.mint("0xRecipient", amount);
await tx.wait();
```

### Check Balance
```javascript
const balance = await pusd.balanceOf("0xAddress");
console.log(ethers.formatUnits(balance, 6), "PUSD");
```

---

## 🛠️ Troubleshooting

### Compilation Issues
```bash
# Clean artifacts
npm run clean

# Remove cache
rm -rf cache artifacts typechain-types

# Reinstall and recompile
npm install
npm run compile
```

### Test Failures
```bash
# Run with verbose output
npx hardhat test --verbose

# Run single test file
npx hardhat test test/PUSD.test.ts

# Run with traces
npx hardhat test --fulltrace
```

### Network Issues
```bash
# Check network config
cat hardhat.config.ts

# Test connection
npx hardhat console --network sepolia
await ethers.provider.getNetwork()
```

---

## 📚 Advanced Commands

### Fork Mainnet
```bash
# Fork in config or CLI
npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY

# Test against real contracts!
```

### Account Management
```bash
# List accounts
npx hardhat accounts

# Use specific account
npx hardhat run scripts/deploy.ts --network sepolia
```

### TypeChain
```bash
# Generate types (done automatically on compile)
npm run typechain

# Types location
ls typechain-types/
```

---

## 🎯 Daily Workflow

### Morning Routine
```bash
# 1. Pull latest
git pull

# 2. Install dependencies (if needed)
npm install

# 3. Compile
npm run compile
```

### During Development
```bash
# 1. Make changes to contracts/

# 2. Compile
npm run compile

# 3. Test
npm test

# 4. If passing, commit
git add .
git commit -m "feat: Your feature"
```

### Deployment Day
```bash
# 1. Final test with gas
npm run test:gas

# 2. Deploy to local first
npm run node &
npm run deploy:local

# 3. If working, deploy to Sepolia
npm run deploy:sepolia

# 4. Verify (auto-done) and interact
npm run interact:sepolia
```

---

## 🔐 Environment Setup

### Create .env file
```bash
# .env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-private-key-without-0x
ETHERSCAN_API_KEY=your-etherscan-api-key
REPORT_GAS=true
```

### Get API Keys
- **Alchemy**: https://www.alchemy.com/
- **Etherscan**: https://etherscan.io/myapikey

---

## 📊 Current Project Status

- ✅ TypeScript fully configured
- ✅ 15 tests passing
- ✅ Gas reporting enabled
- ✅ Deployed on Sepolia: `0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc`
- ✅ TypeChain types generated
- ✅ Professional setup complete

---

## 🎓 Learning Resources

### Documentation
- Hardhat: https://hardhat.org/docs
- Ethers.js: https://docs.ethers.org/
- TypeChain: https://github.com/dethcrypto/TypeChain
- OpenZeppelin: https://docs.openzeppelin.com/

### Your Files
- Tests: `test/PUSD.test.ts`
- Scripts: `scripts/*.ts`
- Config: `hardhat.config.ts`
- Types: `typechain-types/`

---

## ⚡ Pro Tips

1. **Use console for quick checks** - Faster than writing scripts
2. **Test locally first** - Save Sepolia ETH
3. **Gas report** - Optimize before deploying
4. **TypeScript** - Let IDE catch errors early
5. **Git branches** - Test features in branches first

---

## 🎉 You're All Set!

**Next command to run:**
```bash
npm test
```

See your beautiful test results! 🚀

---

*Cheat sheet for PUSD Stablecoin Project*  
*Updated: TypeScript Migration Complete*

