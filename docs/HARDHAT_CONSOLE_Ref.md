# 🎮 Hardhat Console Guide - PUSD v2 Operations

Complete step-by-step guide for interacting with PUSD v2 contract using Hardhat console.

---

## 🚀 Getting Started

### Start Local Blockchain

```bash
# Terminal 1: Start local Hardhat node
npm run node
```

### Open Console

```bash
# Terminal 2: Open Hardhat console
npx hardhat console --network localhost
```

**Or for Sepolia:**

```bash
npx hardhat console --network sepolia
```

---

## 📋 Table of Contents

1. [Deploy Contract](#1-deploy-contract)
2. [Get Wallet Addresses](#2-get-wallet-addresses)
3. [Check Initial Balances](#3-check-initial-balances)
4. [Transfer Tokens](#4-transfer-tokens)
5. [Mint New Tokens](#5-mint-new-tokens)
6. [Redeem (Burn) Tokens](#6-redeem-burn-tokens)
7. [Final Validation](#7-final-validation)
8. [Utility Commands](#8-utility-commands)

---

## 1. Deploy Contract

### Option A: Connect to Existing Contract

```javascript
// If you already deployed, use that address
const pusdv2 = await ethers.getContractAt(
  "PUSDv2",
  "YOUR_CONTRACT_ADDRESS_HERE"
);

// Verify connection
await pusdv2.getAddress();
```

### Option B: Deploy Fresh Contract

```javascript
console.clear();

// Get contract factory
const PUSDv2 = await ethers.getContractFactory("PUSDv2");

// Deploy
const pusdv2 = await PUSDv2.deploy();

// Wait for deployment
await pusdv2.waitForDeployment();

// Get address (SAVE THIS!)
const address = await pusdv2.getAddress();
console.log("✅ Deployed to:", address);
```

### Verify Contract Info

```javascript
// Check name
await pusdv2.name();
// Expected: 'Pegged USDv2'

// Check symbol
await pusdv2.symbol();
// Expected: 'PUSDv2'

// Check decimals
await pusdv2.decimals();
// Expected: 6n

// Check initial total supply
ethers.formatUnits(await pusdv2.totalSupply(), 6);
// Expected: '1000000.0'
```

---

## 2. Get Wallet Addresses

### Get Test Accounts

```javascript
// Hardhat provides 20 pre-funded accounts
const [owner, user1, user2] = await ethers.getSigners();
```

### Check Addresses

```javascript
// Owner address (deployer)
owner.address;
// Output: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

// User 1 address
user1.address;
// Output: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

// User 2 address
user2.address;
// Output: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
```

### Check ETH Balances

```javascript
// Each account has 10,000 ETH for gas
ethers.formatEther(await ethers.provider.getBalance(owner.address));
// Output: '10000.0'
```

---

## 3. Check Initial Balances

### Owner Balance

```javascript
ethers.formatUnits(await pusdv2.balanceOf(owner.address), 6);
// Expected: '1000000.0' (1 million PUSD)
```

### User1 Balance

```javascript
ethers.formatUnits(await pusdv2.balanceOf(user1.address), 6);
// Expected: '0.0'
```

### User2 Balance

```javascript
ethers.formatUnits(await pusdv2.balanceOf(user2.address), 6);
// Expected: '0.0'
```

### Total Supply

```javascript
ethers.formatUnits(await pusdv2.totalSupply(), 6);
// Expected: '1000000.0'
```

---

## 4. Transfer Tokens

### Transfer from Owner to User1

```javascript
// Transfer 1000 PUSD to user1
await pusdv2.transfer(user1.address, ethers.parseUnits("1000", 6));
```

### Verify Transfer

```javascript
// Check user1 received tokens
ethers.formatUnits(await pusdv2.balanceOf(user1.address), 6);
// Expected: '1000.0'

// Check owner balance decreased
ethers.formatUnits(await pusdv2.balanceOf(owner.address), 6);
// Expected: '999000.0'

// Total supply unchanged
ethers.formatUnits(await pusdv2.totalSupply(), 6);
// Expected: '1000000.0' (same as before)
```

### Transfer Between Users

```javascript
// User1 transfers 100 PUSD to User2
await pusdv2
  .connect(user1)
  .transfer(user2.address, ethers.parseUnits("100", 6));

// Verify
ethers.formatUnits(await pusdv2.balanceOf(user1.address), 6);
// Expected: '900.0'

ethers.formatUnits(await pusdv2.balanceOf(user2.address), 6);
// Expected: '100.0'
```

---

## 5. Mint New Tokens

### Mint to User2 (Owner Only)

```javascript
// Mint 500 PUSD to user2
await pusdv2.mint(user2.address, ethers.parseUnits("500", 6));
```

### Verify Mint

```javascript
// Check user2 balance increased
ethers.formatUnits(await pusdv2.balanceOf(user2.address), 6);
// Expected: '600.0' (100 from transfer + 500 minted)

// IMPORTANT: Total supply INCREASED
ethers.formatUnits(await pusdv2.totalSupply(), 6);
// Expected: '1000500.0' (1M + 500)
```

### Test Non-Owner Cannot Mint

```javascript
// This should fail
await pusdv2.connect(user1).mint(user2.address, ethers.parseUnits("100", 6));
// Expected: Error - only owner can mint
```

---

## 6. Redeem (Burn) Tokens

### User1 Redeems for USD

```javascript
// User1 redeems 100 PUSD for USD
await pusdv2.connect(user1).redeem(ethers.parseUnits("100", 6), "USD");
```

### Verify Redeem

```javascript
// Check user1 balance decreased
ethers.formatUnits(await pusdv2.balanceOf(user1.address), 6);
// Expected: '800.0' (was 900, burned 100)

// CRITICAL: Total supply DECREASED
ethers.formatUnits(await pusdv2.totalSupply(), 6);
// Expected: '1000400.0' (was 1,000,500, burned 100)
```

### Redeem Different Currency

```javascript
// User2 redeems 50 PUSD for EUR
await pusdv2.connect(user2).redeem(ethers.parseUnits("50", 6), "EUR");

// Verify
ethers.formatUnits(await pusdv2.balanceOf(user2.address), 6);
// Expected: '550.0' (was 600, burned 50)

ethers.formatUnits(await pusdv2.totalSupply(), 6);
// Expected: '1000350.0' (burned another 50)
```

### Redeem with GBP

```javascript
// User1 redeems 25 PUSD for GBP
await pusdv2.connect(user1).redeem(ethers.parseUnits("25", 6), "GBP");

// Verify
ethers.formatUnits(await pusdv2.balanceOf(user1.address), 6);
// Expected: '775.0'
```

---

## 7. Final Validation

### Check All Balances

```javascript
console.log("=== FINAL BALANCES ===");
console.log(
  "Owner:",
  ethers.formatUnits(await pusdv2.balanceOf(owner.address), 6),
  "PUSD"
);
console.log(
  "User1:",
  ethers.formatUnits(await pusdv2.balanceOf(user1.address), 6),
  "PUSD"
);
console.log(
  "User2:",
  ethers.formatUnits(await pusdv2.balanceOf(user2.address), 6),
  "PUSD"
);
console.log(
  "Total Supply:",
  ethers.formatUnits(await pusdv2.totalSupply(), 6),
  "PUSD"
);
```

### Verify Ownership

```javascript
// Check contract owner
(await pusdv2.owner()(
  // Should match owner.address

  // Verify
  await pusdv2.owner()
)) === owner.address;
// Expected: true
```

### Get Transaction Details

```javascript
// Get latest transaction
const tx = await pusdv2
  .connect(user1)
  .redeem(ethers.parseUnits("10", 6), "USD");

// Get receipt
const receipt = await tx.wait();

// Transaction hash
console.log("TX Hash:", tx.hash);

// Gas used
console.log("Gas used:", receipt.gasUsed.toString());
```

---

## 8. Utility Commands

### Clear Screen

```javascript
console.clear();
```

### Check Network

```javascript
await ethers.provider.getNetwork();
// Local: { chainId: 31337n }
// Sepolia: { chainId: 11155111n }
```

### Get Block Number

```javascript
await ethers.provider.getBlockNumber();
// Shows current block height
```

### Format/Parse Amounts

```javascript
// Parse (string → BigInt)
ethers.parseUnits("100", 6);
// Output: 100000000n

// Format (BigInt → string)
ethers.formatUnits(100000000n, 6);
// Output: '100.0'
```

### Get All Signers

```javascript
const allSigners = await ethers.getSigners();
allSigners.length;
// Output: 20 (Hardhat provides 20 accounts)
```

### Exit Console

```javascript
.exit
// Or press Ctrl+C twice
// Or press Ctrl+D
```

---

## 📊 Quick Reference Table

| Operation    | Command                           | Changes Total Supply? |
| ------------ | --------------------------------- | --------------------- |
| **Transfer** | `pusdv2.transfer(to, amount)`     | ❌ No                 |
| **Mint**     | `pusdv2.mint(to, amount)`         | ✅ Yes (+)            |
| **Redeem**   | `pusdv2.redeem(amount, currency)` | ✅ Yes (-)            |
| **Balance**  | `pusdv2.balanceOf(address)`       | -                     |
| **Supply**   | `pusdv2.totalSupply()`            | -                     |

---

## 🎯 Common Workflows

### Quick Test Workflow

```javascript
// 1. Deploy
const PUSDv2 = await ethers.getContractFactory("PUSDv2");
const pusdv2 = await PUSDv2.deploy();
await pusdv2.waitForDeployment();

// 2. Get accounts
const [owner, user1, user2] = await ethers.getSigners();

// 3. Transfer some tokens
await pusdv2.transfer(user1.address, ethers.parseUnits("1000", 6));

// 4. User redeems
await pusdv2.connect(user1).redeem(ethers.parseUnits("100", 6), "USD");

// 5. Check results
ethers.formatUnits(await pusdv2.totalSupply(), 6);
```

### Validation Workflow

```javascript
// Check everything is working
(await pusdv2.name()) === "Pegged USDv2";
(await pusdv2.symbol()) === "PUSDv2";
(await pusdv2.decimals()) === 6n;
ethers.formatUnits(await pusdv2.totalSupply(), 6) === "1000000.0";
```

---

## 💡 Pro Tips

1. **Always use `await`** - All contract calls are async
2. **Use `ethers.parseUnits("amount", 6)`** - For 6 decimal tokens
3. **Use `ethers.formatUnits(bigint, 6)`** - To display readable amounts
4. **Use `.connect(signer)`** - To act as different users
5. **Save contract address** - You'll need it to reconnect
6. **Press ↑** - To repeat previous commands
7. **Use `console.clear()`** - For clean screen
8. **Check network first** - Know if you're on local or Sepolia

---

## ⚠️ Common Errors & Solutions

### Error: "Cannot read property 'transfer' of undefined"

**Solution**: Deploy or connect to contract first

```javascript
const pusdv2 = await ethers.getContractAt("PUSDv2", "ADDRESS");
```

### Error: "Insufficient balance"

**Solution**: Check balance before transfer/redeem

```javascript
ethers.formatUnits(await pusdv2.balanceOf(address), 6);
```

### Error: "Only owner can mint"

**Solution**: Use owner account or transfer ownership

```javascript
// Use owner
await pusdv2.mint(user.address, amount);

// Or transfer ownership
await pusdv2.transferOwnership(newOwner.address);
```

### "undefined" appears

**Solution**: This is NORMAL! JavaScript console shows undefined for commands that don't return values

```javascript
const x = 5; // Shows: undefined (normal!)
x; // Shows: 5 (the value)
```

---

## 📚 Additional Resources

- **Hardhat Docs**: https://hardhat.org/docs
- **Ethers.js Docs**: https://docs.ethers.org/
- **OpenZeppelin**: https://docs.openzeppelin.com/
- **Your README**: `../README.md`
- **Commands Cheatsheet**: `./COMMANDS_QUICK Ref.md`

---

## 🎓 Summary

**What You Learned:**

- ✅ Deploy contracts in console
- ✅ Get and use test accounts
- ✅ Transfer tokens between accounts
- ✅ Mint new tokens (increases supply)
- ✅ Redeem/burn tokens (decreases supply)
- ✅ Validate all operations
- ✅ Use multi-currency redemptions
- ✅ Check ownership and balances

**Key Takeaways:**

- Console = JavaScript (scripts = TypeScript)
- Local testing is free and instant
- Always format amounts with `parseUnits` and `formatUnits`
- Use `.connect(user)` to act as different accounts
- Redeem burns tokens forever (v2 feature!)

---

_Guide created for PUSD Stablecoin v2 Project_  
_Last updated: 2025_
