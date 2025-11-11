import { expect } from "chai";
import { ethers } from "hardhat";
import { PUSDv3 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import sepoliaConfig from "./fixtures/sepolia-config.json";
import testWallets from "./fixtures/test-wallets.json";

/**
 * Integration Tests for PUSDv3 on Sepolia Testnet

 * RUN:
 * npx hardhat test test/PUSDv3.integration.test.ts --network sepolia
 */

describe("PUSDv3 Integration Tests (Sepolia)", function () {
  // Set longer timeout for network tests
  this.timeout(120000); // 2 minutes

  let pusdv3: PUSDv3;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress | null = null;
  let addr2: SignerWithAddress | null = null;

  const CONTRACT_ADDRESS = sepoliaConfig.contracts.pusdv3.address;

  before(async function () {
    console.log("\n🔗 Connecting to deployed PUSDv3 on Sepolia...");
    console.log("📊 Contract Address:", CONTRACT_ADDRESS);
    console.log(
      "🔗 Etherscan:",
      `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`
    );
    console.log("\n" + "=".repeat(60) + "\n");

    // Get available signers
    const signers = await ethers.getSigners();
    owner = signers[0];

    // Optional: Set additional wallets if available
    if (signers.length > 1) {
      addr1 = signers[1];
      console.log("✅ Test wallet 2 available:", addr1.address);
    }
    if (signers.length > 2) {
      addr2 = signers[2];
      console.log("✅ Test wallet 3 available:", addr2.address);
    }

    console.log("\n💼 Testing with wallet:", owner.address);

    // Check gas balances for all wallets
    console.log("\n⛽ Checking Gas Balances...\n");
    const MIN_BALANCE = ethers.parseEther("0.01"); // Minimum 0.01 ETH required
    const insufficientWallets: {
      address: string;
      balance: string;
      name: string;
    }[] = [];

    // Check owner wallet
    const ownerBalance = await ethers.provider.getBalance(owner.address);
    console.log(
      `   Wallet 1 (Owner):    ${ethers.formatEther(ownerBalance)} ETH`
    );
    if (ownerBalance < MIN_BALANCE) {
      insufficientWallets.push({
        address: owner.address,
        balance: ethers.formatEther(ownerBalance),
        name: "Wallet 1 (Owner)",
      });
    }

    // Check wallet 2 if available
    if (addr1) {
      const addr1Balance = await ethers.provider.getBalance(addr1.address);
      console.log(
        `   Wallet 2 (Recipient): ${ethers.formatEther(addr1Balance)} ETH`
      );
      if (addr1Balance < MIN_BALANCE) {
        insufficientWallets.push({
          address: addr1.address,
          balance: ethers.formatEther(addr1Balance),
          name: "Wallet 2 (Recipient)",
        });
      }
    }

    // Check wallet 3 if available
    if (addr2) {
      const addr2Balance = await ethers.provider.getBalance(addr2.address);
      console.log(
        `   Wallet 3 (Test):      ${ethers.formatEther(addr2Balance)} ETH`
      );
      if (addr2Balance < MIN_BALANCE) {
        insufficientWallets.push({
          address: addr2.address,
          balance: ethers.formatEther(addr2Balance),
          name: "Wallet 3 (Test)",
        });
      }
    }

    // If any wallet has insufficient balance, fail with clear message
    if (insufficientWallets.length > 0) {
      console.log("\n" + "=".repeat(60));
      console.log("❌ INSUFFICIENT GAS FEES - TESTS ABORTED");
      console.log("=".repeat(60));
      console.log(
        "\nThe following wallets have insufficient Sepolia ETH for gas:\n"
      );

      insufficientWallets.forEach((wallet) => {
        console.log(`   ${wallet.name}`);
        console.log(`   Address: ${wallet.address}`);
        console.log(`   Current: ${wallet.balance} ETH`);
        console.log(`   Required: 0.01 ETH minimum\n`);
      });

      console.log("📝 How to fix:");
      console.log("   1. Get Sepolia ETH from a faucet:");
      console.log("      - https://sepoliafaucet.com/");
      console.log("      - https://www.infura.io/faucet/sepolia");
      console.log("   2. Or send from Wallet 1 to other wallets");
      console.log("\n" + "=".repeat(60) + "\n");

      throw new Error(
        `Insufficient gas fees: ${insufficientWallets.length} wallet(s) need more Sepolia ETH`
      );
    }

    console.log("\n✅ All wallets have sufficient gas fees!");
    const balance = await ethers.provider.getBalance(owner.address);
    console.log(
      "💰 Primary wallet balance:",
      ethers.formatEther(balance),
      "ETH"
    );

    // Connect to deployed contract
    const PUSDv3Factory = await ethers.getContractFactory("PUSDv3");
    pusdv3 = PUSDv3Factory.attach(CONTRACT_ADDRESS) as unknown as PUSDv3;

    console.log("\n" + "=".repeat(60) + "\n");
  });

  describe("📖 Contract State Verification", function () {
    it("Should have correct token details", async function () {
      expect(await pusdv3.name()).to.equal("Pegged USDv3");
      expect(await pusdv3.symbol()).to.equal("PUSDv3");
      expect(await pusdv3.decimals()).to.equal(6);
    });

    it("Should have correct max supply", async function () {
      const maxSupply = await pusdv3.MAX_SUPPLY();
      expect(maxSupply).to.equal(ethers.parseUnits("100000000", 6));
    });

    it("Should have correct owner", async function () {
      const contractOwner = await pusdv3.owner();
      console.log("   Contract owner:", contractOwner);
      expect(contractOwner).to.equal(owner.address);
    });

    it("Should show current total supply", async function () {
      const totalSupply = await pusdv3.totalSupply();
      const decimals = await pusdv3.decimals();
      console.log(
        "   Total supply:",
        ethers.formatUnits(totalSupply, decimals),
        "PUSDv3"
      );
      expect(totalSupply).to.be.gt(0);
    });

    it("Should show owner balance", async function () {
      const balance = await pusdv3.balanceOf(owner.address);
      const decimals = await pusdv3.decimals();
      console.log(
        "   Owner balance:",
        ethers.formatUnits(balance, decimals),
        "PUSDv3"
      );
      expect(balance).to.be.gt(0);
    });

    it("Should check if contract is paused", async function () {
      const paused = await pusdv3.paused();
      console.log("   Contract paused:", paused);
      expect(typeof paused).to.equal("boolean");
    });
  });

  describe("🪙 Minting Operations", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseUnits(sepoliaConfig.testAmounts.mint, 6);
      const balanceBefore = await pusdv3.balanceOf(owner.address);

      console.log("   Minting 1,000 PUSDv3 tokens...");
      const tx = await pusdv3.mint(owner.address, mintAmount);
      const receipt = await tx.wait();

      console.log("   ✅ Minted! Tx:", receipt?.hash);
      console.log("   ⛽ Gas used:", receipt?.gasUsed.toString());

      const balanceAfter = await pusdv3.balanceOf(owner.address);
      expect(balanceAfter).to.equal(balanceBefore + mintAmount);
    });

    it("Should not exceed max supply when minting", async function () {
      const totalSupply = await pusdv3.totalSupply();
      const maxSupply = await pusdv3.MAX_SUPPLY();

      console.log("   Current supply:", ethers.formatUnits(totalSupply, 6));
      console.log("   Max supply:", ethers.formatUnits(maxSupply, 6));
      console.log(
        "   Remaining mintable:",
        ethers.formatUnits(maxSupply - totalSupply, 6)
      );

      expect(totalSupply).to.be.lte(maxSupply);
    });
  });

  describe("💸 Transfer Operations", function () {
    it("Should allow token transfers", async function () {
      if (!addr1) {
        this.skip(); // Skip if second wallet not available
      }
      const recipient = addr1.address;
      const transferAmount = ethers.parseUnits(
        sepoliaConfig.testAmounts.transfer,
        6
      );

      const balanceBefore = await pusdv3.balanceOf(owner.address);
      const recipientBalanceBefore = await pusdv3.balanceOf(recipient);

      console.log("   Transferring 100 PUSDv3 to:", recipient);
      const tx = await pusdv3.transfer(recipient, transferAmount);
      const receipt = await tx.wait();

      console.log("   ✅ Transferred! Tx:", receipt?.hash);
      console.log("   ⛽ Gas used:", receipt?.gasUsed.toString());

      const balanceAfter = await pusdv3.balanceOf(owner.address);
      const recipientBalanceAfter = await pusdv3.balanceOf(recipient);

      expect(balanceAfter).to.equal(balanceBefore - transferAmount);
      expect(recipientBalanceAfter).to.equal(
        recipientBalanceBefore + transferAmount
      );
    });

    it("Should not allow transfers when paused", async function () {
      if (!addr1) {
        this.skip(); // Skip if second wallet not available
      }
      console.log("   Pausing contract...");
      const pauseTx = await pusdv3.pause();
      await pauseTx.wait();
      console.log("   ✅ Contract paused");

      const recipient = addr1.address;
      const transferAmount = ethers.parseUnits(
        sepoliaConfig.testAmounts.smallTransfer,
        6
      );

      console.log("   Attempting transfer while paused...");
      await expect(
        pusdv3.transfer(recipient, transferAmount)
      ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");

      console.log("   ✅ Transfer blocked as expected");
      console.log("   Unpausing contract...");
      const unpauseTx = await pusdv3.unpause();
      await unpauseTx.wait();
      console.log("   ✅ Contract unpaused");
    });
  });

  describe("🔥 Burn Operations", function () {
    it("Should allow burning tokens via redeem", async function () {
      const burnAmount = ethers.parseUnits(sepoliaConfig.testAmounts.burn, 6);
      const balanceBefore = await pusdv3.balanceOf(owner.address);
      const totalSupplyBefore = await pusdv3.totalSupply();

      console.log("   Burning 50 PUSDv3 tokens via redeem...");
      const tx = await pusdv3.redeem(burnAmount, "USD");
      const receipt = await tx.wait();

      console.log("   ✅ Burned! Tx:", receipt?.hash);
      console.log("   ⛽ Gas used:", receipt?.gasUsed.toString());

      const balanceAfter = await pusdv3.balanceOf(owner.address);
      const totalSupplyAfter = await pusdv3.totalSupply();

      expect(balanceAfter).to.equal(balanceBefore - burnAmount);
      expect(totalSupplyAfter).to.equal(totalSupplyBefore - burnAmount);
    });
  });

  describe("🔄 Redeem Operations", function () {
    it("Should allow redeeming tokens", async function () {
      const redeemAmount = ethers.parseUnits(
        sepoliaConfig.testAmounts.redeem,
        6
      );
      const balanceBefore = await pusdv3.balanceOf(owner.address);
      const totalSupplyBefore = await pusdv3.totalSupply();

      console.log("   Redeeming 25 PUSDv3 tokens for USD...");
      const tx = await pusdv3.redeem(redeemAmount, "USD");
      const receipt = await tx.wait();

      console.log("   ✅ Redeemed! Tx:", receipt?.hash);
      console.log("   ⛽ Gas used:", receipt?.gasUsed.toString());

      const balanceAfter = await pusdv3.balanceOf(owner.address);
      const totalSupplyAfter = await pusdv3.totalSupply();

      expect(balanceAfter).to.equal(balanceBefore - redeemAmount);
      expect(totalSupplyAfter).to.equal(totalSupplyBefore - redeemAmount);
    });
  });

  describe("⏸️ Pause/Unpause Operations", function () {
    it("Should allow owner to pause and unpause", async function () {
      const pausedBefore = await pusdv3.paused();
      console.log("   Initial paused state:", pausedBefore);

      if (!pausedBefore) {
        console.log("   Pausing contract...");
        const pauseTx = await pusdv3.pause();
        await pauseTx.wait();
        expect(await pusdv3.paused()).to.be.true;
        console.log("   ✅ Contract paused");
      }

      console.log("   Unpausing contract...");
      const unpauseTx = await pusdv3.unpause();
      await unpauseTx.wait();
      expect(await pusdv3.paused()).to.be.false;
      console.log("   ✅ Contract unpaused");
    });
  });

  describe("🚫 Blacklist Operations", function () {
    it("Should allow owner to blacklist and unblacklist addresses", async function () {
      if (!addr1) {
        this.skip(); // Skip if second wallet not available
      }
      const testAddress = addr1.address;

      console.log("   Blacklisting address:", testAddress);
      const blacklistTx = await pusdv3.blacklist(testAddress);
      await blacklistTx.wait();

      const isBlacklisted = await pusdv3.blacklisted(testAddress);
      expect(isBlacklisted).to.be.true;
      console.log("   ✅ Address blacklisted");

      console.log("   Unblacklisting address:", testAddress);
      const unblacklistTx = await pusdv3.unblacklist(testAddress);
      await unblacklistTx.wait();

      const isStillBlacklisted = await pusdv3.blacklisted(testAddress);
      expect(isStillBlacklisted).to.be.false;
      console.log("   ✅ Address unblacklisted");
    });

    it("Should not allow blacklisted addresses to transfer", async function () {
      if (!addr1) {
        this.skip(); // Skip if second wallet not available
      }
      const testAddress = addr1.address;

      // First, send some tokens to test address
      const amount = ethers.parseUnits("10", 6);
      await pusdv3.transfer(testAddress, amount);

      // Blacklist the address
      console.log("   Blacklisting address:", testAddress);
      await pusdv3.blacklist(testAddress);

      // Try to transfer from blacklisted address (if we have access to it)
      if (addr1) {
        console.log("   Attempting transfer from blacklisted address...");
        await expect(
          pusdv3
            .connect(addr1)
            .transfer(owner.address, ethers.parseUnits("1", 6))
        ).to.be.revertedWith("Address is blacklisted");
        console.log("   ✅ Transfer blocked as expected");
      }

      // Clean up
      await pusdv3.unblacklist(testAddress);
      console.log("   ✅ Address unblacklisted (cleanup)");
    });
  });

  describe("📊 Final State Report", function () {
    it("Should display final contract state", async function () {
      const decimals = await pusdv3.decimals();
      const totalSupply = await pusdv3.totalSupply();
      const maxSupply = await pusdv3.MAX_SUPPLY();
      const ownerBalance = await pusdv3.balanceOf(owner.address);
      const paused = await pusdv3.paused();

      console.log("\n" + "=".repeat(60));
      console.log("📊 FINAL CONTRACT STATE");
      console.log("=".repeat(60));
      console.log("Contract Address:", CONTRACT_ADDRESS);
      console.log(
        "Total Supply:    ",
        ethers.formatUnits(totalSupply, decimals),
        "PUSDv3"
      );
      console.log(
        "Max Supply:      ",
        ethers.formatUnits(maxSupply, decimals),
        "PUSDv3"
      );
      console.log(
        "Owner Balance:   ",
        ethers.formatUnits(ownerBalance, decimals),
        "PUSDv3"
      );
      console.log("Paused:          ", paused);
      console.log("Owner:           ", owner.address);
      console.log("=".repeat(60) + "\n");

      expect(true).to.be.true; // Always pass, just for reporting
    });
  });
});
