# Integration Testing Guide - Sepolia Testnet

## Overview

This guide explains how to run integration tests on the Sepolia testnet with your deployed PUSDv3 contract.

## Wallet Requirements

### Option 1: Single Wallet Testing (MINIMUM)

**What you need:**

- 1 wallet (your deployer wallet)
- Sepolia ETH for gas (~0.05 ETH recommended)

**What you can test:**

- ✅ Contract state verification
- ✅ Minting tokens
- ✅ Burning tokens
- ✅ Redeeming tokens
- ✅ Pause/Unpause
- ✅ Basic blacklist operations
- ⚠️ Limited transfer testing (uses fallback addresses)

**Configuration:**

```bash
# .env file
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-deployer-private-key-without-0x
ETHERSCAN_API_KEY=your-etherscan-api-key
```

### Option 2: Multi-Wallet Testing (RECOMMENDED)

**What you need:**

- 2-3 wallets
- Sepolia ETH distributed across wallets

**What you can test:**

- ✅ All features from Option 1
- ✅ Full transfer testing between addresses
- ✅ Comprehensive blacklist testing
- ✅ Real multi-party scenarios

**How to get multiple wallets:**

#### Method 1: Use Hardhat's Account Derivation (Easiest)

Hardhat can derive multiple accounts from your seed phrase. Update `hardhat.config.ts`:

```typescript
sepolia: {
  url: process.env.SEPOLIA_RPC_URL || "",
  accounts: {
    mnemonic: process.env.MNEMONIC || "",
    count: 3, // Generate 3 accounts
  },
  chainId: 11155111,
}
```

Then in `.env`:

```bash
MNEMONIC="your twelve word seed phrase here"
```

**⚠️ Important:** You'll need to fund all 3 addresses with Sepolia ETH.

#### Method 2: Multiple Private Keys

Add multiple private keys to your Hardhat config:

```typescript
sepolia: {
  url: process.env.SEPOLIA_RPC_URL || "",
  accounts: [
    process.env.PRIVATE_KEY,
    process.env.TEST_WALLET_2,
    process.env.TEST_WALLET_3,
  ].filter(Boolean) as string[], // Remove undefined values
  chainId: 11155111,
}
```

Then in `.env`:

```bash
PRIVATE_KEY=deployer-wallet-private-key
TEST_WALLET_2=second-wallet-private-key
TEST_WALLET_3=third-wallet-private-key
```

## Getting Sepolia ETH

You need Sepolia ETH to pay for gas fees. Get free testnet ETH from these faucets:

1. **Alchemy Sepolia Faucet** (Recommended)

   - URL: https://sepoliafaucet.com/
   - Requires: Alchemy account
   - Amount: 0.5 ETH/day

2. **Infura Faucet**

   - URL: https://www.infura.io/faucet/sepolia
   - Requires: Infura account
   - Amount: 0.5 ETH/day

3. **Google Cloud Faucet**
   - URL: https://cloud.google.com/application/web3/faucet/ethereum/sepolia
   - Requires: Google account
   - Amount: Variable

### Distributing ETH to Multiple Wallets

If using multiple wallets, send Sepolia ETH from your main wallet:

```bash
# In MetaMask, send 0.02 ETH to each test wallet address
```

## Running Integration Tests

### 1. Run All Tests

```bash
npx hardhat test test/PUSDv3.integration.test.ts --network sepolia
```

### 2. Run Specific Test Suite

```bash
npx hardhat test test/PUSDv3.integration.test.ts --network sepolia --grep "Minting Operations"
```

### 3. View Detailed Output

```bash
npx hardhat test test/PUSDv3.integration.test.ts --network sepolia --verbose
```

## Test Coverage

The integration test suite includes:

### 📖 Contract State Verification

- Token details (name, symbol, decimals)
- Max supply verification
- Owner verification
- Total supply and balances
- Pause state

### 🪙 Minting Operations

- Mint tokens to owner
- Max supply cap verification
- Gas usage tracking

### 💸 Transfer Operations

- Token transfers
- Transfer blocking when paused
- Gas usage tracking

### 🔥 Burn Operations

- Token burning
- Supply reduction verification

### 🔄 Redeem Operations

- Token redemption
- Supply reduction verification

### ⏸️ Pause/Unpause Operations

- Pause contract
- Unpause contract
- State verification

### 🚫 Blacklist Operations

- Blacklist addresses
- Unblacklist addresses
- Transfer blocking for blacklisted addresses

### 📊 Final State Report

- Complete contract state summary

## Expected Gas Costs

Approximate gas costs on Sepolia (prices vary):

| Operation | Gas Used | Approx Cost (0.5 Gwei) |
| --------- | -------- | ---------------------- |
| Mint      | ~50,000  | 0.000025 ETH           |
| Transfer  | ~50,000  | 0.000025 ETH           |
| Burn      | ~35,000  | 0.000018 ETH           |
| Redeem    | ~35,000  | 0.000018 ETH           |
| Pause     | ~30,000  | 0.000015 ETH           |
| Blacklist | ~45,000  | 0.000023 ETH           |

**Total for full test suite:** ~0.01-0.02 ETH

## Troubleshooting

### Error: "Insufficient funds for gas"

**Solution:** Add more Sepolia ETH to your wallet from a faucet.

### Error: "Contract not found"

**Solution:** Verify `deployments/sepolia-v3.json` has the correct contract address.

### Error: "Nonce too high"

**Solution:** Reset your account in MetaMask (Settings → Advanced → Reset Account).

### Tests failing with "Ownable: caller is not the owner"

**Solution:** Ensure the PRIVATE_KEY in `.env` matches the deployer/owner address.

### Error: "Network request failed"

**Solution:** Check your SEPOLIA_RPC_URL is correct and your RPC provider is working.

## Best Practices

1. **Test on Sepolia First** - Always test on Sepolia before mainnet
2. **Keep Separate Wallets** - Don't use mainnet wallets for testnet testing
3. **Monitor Gas Usage** - Tests will cost real Sepolia ETH
4. **Run Tests Periodically** - Verify contract functionality over time
5. **Document Changes** - Keep track of contract upgrades and tests
6. **Backup Private Keys** - Store keys securely (but not in git!)

## Comparison: Local vs Testnet Testing

| Aspect   | Local (Hardhat) | Testnet (Sepolia)               |
| -------- | --------------- | ------------------------------- |
| Speed    | ⚡ Very Fast    | 🐢 Slower (block times)         |
| Cost     | 💰 Free         | 💸 Gas costs (free testnet ETH) |
| Setup    | ✅ Simple       | ⚙️ More complex                 |
| Realism  | ⚠️ Simulated    | ✅ Real blockchain              |
| Use Case | Development     | Pre-production verification     |

## When to Run Each Type of Test

### Run Local Tests (`test/PUSDv3.test.ts`)

- ✅ During development
- ✅ Before every commit
- ✅ In CI/CD pipelines
- ✅ For comprehensive test coverage
- ✅ Fast iteration and debugging

### Run Integration Tests (`test/PUSDv3.integration.test.ts`)

- ✅ Before deploying to mainnet
- ✅ After contract upgrades
- ✅ Weekly/monthly for monitoring
- ✅ When testing with real RPC providers
- ✅ To verify contract behavior in production-like environment

## Summary

**Minimum Setup (1 wallet):**

- ✅ Sufficient for basic testing
- ✅ Lower gas costs
- ⚠️ Limited multi-party scenarios

**Recommended Setup (2-3 wallets):**

- ✅ Comprehensive testing
- ✅ Real-world scenarios
- ✅ Better confidence before mainnet
- ⚠️ Higher gas costs (still minimal on testnet)

---

**Happy Testing! 🚀**

For questions or issues, check:

- Contract on Etherscan: https://sepolia.etherscan.io/address/0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5
- Hardhat Documentation: https://hardhat.org/
- Ethers.js Documentation: https://docs.ethers.org/
