import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local Hardhat network
    hardhat: {
      chainId: 31337,
    },
    // Sepolia testnet
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [
        process.env.PRIVATE_KEY,
        process.env.TEST_WALLET_2,
        process.env.TEST_WALLET_3,
      ].filter(Boolean) as string[],
      chainId: 11155111,
    },
    // Mainnet (for forking/testing)
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
  },
};

export default config;
