# Test Fixtures

This directory contains test configuration and fixture data for integration testing.

## File Structure

```
test/fixtures/
├── README.md                    # This file
├── sepolia-config.json          # Network and contract configuration
└── test-wallets.json            # Test wallet addresses
```

## Files

### `sepolia-config.json`
**Purpose:** Network-specific configuration for Sepolia testnet testing

**Contains:**
- Contract addresses (deployed contracts)
- Test amounts for operations (mint, transfer, burn, etc.)
- Gas limits for various operations
- Network details (chainId, etc.)

**When to update:**
- After deploying new contracts
- When adjusting test amounts
- When gas limits need to be changed

### `test-wallets.json`
**Purpose:** Test wallet addresses for integration testing

**Contains:**
- Public wallet addresses (NOT private keys!)
- Wallet descriptions and purposes
- Reference to corresponding .env keys
- Fallback addresses for single-wallet testing

**When to update:**
- When adding new test wallets
- When changing wallet roles
- Never commit private keys here!

## Security Guidelines

### ✅ Safe to commit:
- Public wallet addresses
- Contract addresses
- Network configurations
- Test amounts
- Gas limits

### ❌ NEVER commit:
- Private keys
- Seed phrases
- API keys
- Sensitive credentials

**All sensitive data should go in `.env` file!**

## Usage in Tests

```typescript
import sepoliaConfig from "./fixtures/sepolia-config.json";
import testWallets from "./fixtures/test-wallets.json";

// Use contract address
const contract = await ethers.getContractAt(
  "PUSDv3", 
  sepoliaConfig.contracts.pusdv3.address
);

// Use test amounts
const amount = ethers.parseUnits(sepoliaConfig.testAmounts.mint, 6);

// Use wallet addresses
const recipient = testWallets.fallbackAddresses.recipient;
```

## Best Practices

1. **Keep fixtures DRY** - Don't duplicate data across files
2. **Use semantic names** - Clear, descriptive keys
3. **Document changes** - Update this README when adding new fixtures
4. **Version control** - These files should be committed to git
5. **Separate concerns** - Contract data ≠ wallet data ≠ test data

## Multi-Network Support (Future)

To support multiple networks, create network-specific config files:

```
test/fixtures/
├── mainnet-config.json
├── sepolia-config.json
├── goerli-config.json
└── test-wallets.json  # Shared across networks
```

Then import based on the network:

```typescript
const network = process.env.NETWORK || "sepolia";
const config = await import(`./fixtures/${network}-config.json`);
```

## Related Files

- `.env` - Private keys and API keys (NOT committed)
- `deployments/` - Deployment artifacts and history
- `hardhat.config.ts` - Network RPC URLs and account management

---

**Remember:** Fixtures are for **test configuration**, not sensitive data!

