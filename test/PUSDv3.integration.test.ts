import { expect } from "chai";
import { ethers } from "hardhat";
import { PUSDv3 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import sepoliaConfig from "./fixtures/sepolia-config.json";

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
    describe("Basic Functionality", function () {
      it("Should allow owner to pause and unpause the contract", async function () {
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

      it("Should not allow non-owner to pause the contract", async function () {
        if (!addr1) {
          this.skip();
        }
        console.log("   Non-owner attempting to pause...");
        await expect(pusdv3.connect(addr1).pause()).to.be.reverted;
        console.log("   ✅ Pause blocked as expected");
      });

      it("Should not allow non-owner to unpause the contract", async function () {
        if (!addr1) {
          this.skip();
        }
        // First pause the contract as owner
        const pausedBefore = await pusdv3.paused();
        if (!pausedBefore) {
          await pusdv3.pause();
        }

        console.log("   Non-owner attempting to unpause...");
        await expect(pusdv3.connect(addr1).unpause()).to.be.reverted;
        console.log("   ✅ Unpause blocked as expected");

        // Cleanup: unpause as owner
        await pusdv3.unpause();
      });
    });

    describe("When Contract is Paused", function () {
      it("Should block owner from performing mint, transfer, and redeem operations", async function () {
        // Ensure contract is unpaused first
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // Pause the contract
        console.log("   Pausing contract...");
        await pusdv3.pause();
        expect(await pusdv3.paused()).to.be.true;

        const mintAmount = ethers.parseUnits("100", 6);
        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // Owner should not be able to mint when paused
        console.log("   Owner attempting to mint while paused...");
        await expect(
          pusdv3.mint(owner.address, mintAmount)
        ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
        console.log("   ✅ Mint blocked as expected");

        // Owner should not be able to transfer when paused
        if (addr1) {
          console.log("   Owner attempting to transfer while paused...");
          await expect(
            pusdv3.transfer(addr1.address, transferAmount)
          ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
          console.log("   ✅ Transfer blocked as expected");
        }

        // Owner should not be able to redeem when paused
        console.log("   Owner attempting to redeem while paused...");
        await expect(
          pusdv3.redeem(redeemAmount, "USD")
        ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
        console.log("   ✅ Redeem blocked as expected");

        // Cleanup: unpause
        await pusdv3.unpause();
      });

      it("Should block users from performing transfer and redeem operations", async function () {
        if (!addr1) {
          this.skip();
        }

        // Ensure contract is unpaused first
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // Give user some tokens first
        const initialAmount = ethers.parseUnits("100", 6);
        await pusdv3.transfer(addr1.address, initialAmount);

        // Pause the contract
        console.log("   Pausing contract...");
        await pusdv3.pause();

        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // User should not be able to transfer when paused
        console.log("   User attempting to transfer while paused...");
        await expect(
          pusdv3.connect(addr1).transfer(owner.address, transferAmount)
        ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
        console.log("   ✅ Transfer blocked as expected");

        // User should not be able to redeem when paused
        console.log("   User attempting to redeem while paused...");
        await expect(
          pusdv3.connect(addr1).redeem(redeemAmount, "USD")
        ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
        console.log("   ✅ Redeem blocked as expected");

        // Cleanup: unpause
        await pusdv3.unpause();
      });
    });

    describe("When Contract is Unpaused", function () {
      it("Should allow owner and users to perform all operations based on permissions", async function () {
        if (!addr1) {
          this.skip();
        }

        // Ensure contract is unpaused
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // Ensure addresses are not blacklisted
        if (await pusdv3.blacklisted(owner.address)) {
          await pusdv3.unblacklist(owner.address);
        }
        if (await pusdv3.blacklisted(addr1.address)) {
          await pusdv3.unblacklist(addr1.address);
        }

        const mintAmount = ethers.parseUnits("100", 6);
        const transferAmount = ethers.parseUnits("50", 6);
        const redeemAmount = ethers.parseUnits("10", 6);

        // Owner should be able to mint
        console.log("   Owner minting tokens...");
        const balanceBefore = await pusdv3.balanceOf(owner.address);
        await pusdv3.mint(owner.address, mintAmount);
        const balanceAfter = await pusdv3.balanceOf(owner.address);
        expect(balanceAfter).to.equal(balanceBefore + mintAmount);
        console.log("   ✅ Mint successful");

        // Owner should be able to transfer
        console.log("   Owner transferring tokens...");
        const ownerBalanceBefore = await pusdv3.balanceOf(owner.address);
        const userBalanceBefore = await pusdv3.balanceOf(addr1.address);
        await pusdv3.transfer(addr1.address, transferAmount);
        const ownerBalanceAfter = await pusdv3.balanceOf(owner.address);
        const userBalanceAfter = await pusdv3.balanceOf(addr1.address);
        expect(ownerBalanceAfter).to.equal(ownerBalanceBefore - transferAmount);
        expect(userBalanceAfter).to.equal(userBalanceBefore + transferAmount);
        console.log("   ✅ Transfer successful");

        // User should be able to transfer
        console.log("   User transferring tokens...");
        const userBalanceBefore2 = await pusdv3.balanceOf(addr1.address);
        const ownerBalanceBefore2 = await pusdv3.balanceOf(owner.address);
        await pusdv3.connect(addr1).transfer(owner.address, transferAmount);
        const userBalanceAfter2 = await pusdv3.balanceOf(addr1.address);
        const ownerBalanceAfter2 = await pusdv3.balanceOf(owner.address);
        expect(userBalanceAfter2).to.equal(userBalanceBefore2 - transferAmount);
        expect(ownerBalanceAfter2).to.equal(
          ownerBalanceBefore2 + transferAmount
        );
        console.log("   ✅ User transfer successful");

        // Owner should be able to redeem
        console.log("   Owner redeeming tokens...");
        const ownerBalanceBefore3 = await pusdv3.balanceOf(owner.address);
        const totalSupplyBefore = await pusdv3.totalSupply();
        await pusdv3.redeem(redeemAmount, "USD");
        const ownerBalanceAfter3 = await pusdv3.balanceOf(owner.address);
        const totalSupplyAfter = await pusdv3.totalSupply();
        expect(ownerBalanceAfter3).to.equal(ownerBalanceBefore3 - redeemAmount);
        expect(totalSupplyAfter).to.equal(totalSupplyBefore - redeemAmount);
        console.log("   ✅ Owner redeem successful");

        // User should be able to redeem
        // First give user some tokens
        await pusdv3.transfer(addr1.address, redeemAmount);
        console.log("   User redeeming tokens...");
        const userBalanceBefore3 = await pusdv3.balanceOf(addr1.address);
        const totalSupplyBefore2 = await pusdv3.totalSupply();
        await pusdv3.connect(addr1).redeem(redeemAmount, "USD");
        const userBalanceAfter3 = await pusdv3.balanceOf(addr1.address);
        const totalSupplyAfter2 = await pusdv3.totalSupply();
        expect(userBalanceAfter3).to.equal(userBalanceBefore3 - redeemAmount);
        expect(totalSupplyAfter2).to.equal(totalSupplyBefore2 - redeemAmount);
        console.log("   ✅ User redeem successful");
      });
    });
  });

  describe("🚫 Blacklist Operations", function () {
    describe("Basic Functionality", function () {
      it("Should allow owner to blacklist and unblacklist addresses", async function () {
        if (!addr1) {
          this.skip();
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
    });

    describe("Blacklisted User Operations", function () {
      it("Should block blacklisted users from transferring tokens", async function () {
        if (!addr1) {
          this.skip();
        }
        const testAddress = addr1.address;

        // First, send some tokens to test address
        const amount = ethers.parseUnits("10", 6);
        await pusdv3.transfer(testAddress, amount);

        // Blacklist the address
        console.log("   Blacklisting address:", testAddress);
        await pusdv3.blacklist(testAddress);

        // Try to transfer from blacklisted address
        console.log("   Attempting transfer from blacklisted address...");
        await expect(
          pusdv3
            .connect(addr1)
            .transfer(owner.address, ethers.parseUnits("1", 6))
        ).to.be.revertedWith("Sender blacklisted");
        console.log("   ✅ Transfer blocked as expected");

        // Clean up
        await pusdv3.unblacklist(testAddress);
        console.log("   ✅ Address unblacklisted (cleanup)");
      });

      it("Should block blacklisted users from redeeming tokens", async function () {
        if (!addr1) {
          this.skip();
        }

        // Ensure contract is unpaused
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // Ensure user1 is not blacklisted
        if (await pusdv3.blacklisted(addr1.address)) {
          await pusdv3.unblacklist(addr1.address);
        }

        // Give user1 some tokens
        const initialAmount = ethers.parseUnits("100", 6);
        await pusdv3.transfer(addr1.address, initialAmount);

        // Blacklist user1
        console.log("   Blacklisting user1:", addr1.address);
        await pusdv3.blacklist(addr1.address);
        expect(await pusdv3.blacklisted(addr1.address)).to.be.true;
        console.log("   ✅ User1 blacklisted");

        const redeemAmount = ethers.parseUnits("5", 6);

        // User1 should not be able to redeem
        console.log("   User1 attempting to redeem while blacklisted...");
        await expect(
          pusdv3.connect(addr1).redeem(redeemAmount, "USD")
        ).to.be.revertedWith("Sender blacklisted");
        console.log("   ✅ Redeem blocked as expected");

        // Cleanup: unblacklist user1
        await pusdv3.unblacklist(addr1.address);
        console.log("   ✅ User1 unblacklisted (cleanup)");
      });

      it("Should allow unblacklisted users to transfer and redeem tokens", async function () {
        if (!addr1) {
          this.skip();
        }
        const user1 = addr1!; // Non-null assertion after skip check

        // Ensure contract is unpaused
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // Ensure user1 is blacklisted first
        if (!(await pusdv3.blacklisted(user1.address))) {
          await pusdv3.blacklist(user1.address);
        }

        // Unblacklist user1
        console.log("   Unblacklisting user1:", user1.address);
        await pusdv3.unblacklist(user1.address);
        expect(await pusdv3.blacklisted(user1.address)).to.be.false;
        console.log("   ✅ User1 unblacklisted");

        // Give user1 some tokens
        const initialAmount = ethers.parseUnits("100", 6);
        await pusdv3.transfer(user1.address, initialAmount);

        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // User1 should be able to transfer
        console.log("   User1 transferring tokens...");
        const userBalanceBefore = await pusdv3.balanceOf(user1.address);
        const ownerBalanceBefore = await pusdv3.balanceOf(owner.address);
        await pusdv3.connect(user1).transfer(owner.address, transferAmount);
        const userBalanceAfter = await pusdv3.balanceOf(user1.address);
        const ownerBalanceAfter = await pusdv3.balanceOf(owner.address);
        expect(userBalanceAfter).to.equal(userBalanceBefore - transferAmount);
        expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + transferAmount);
        console.log("   ✅ Transfer successful");

        // User1 should be able to redeem
        console.log("   User1 redeeming tokens...");
        const userBalanceBefore2 = await pusdv3.balanceOf(user1.address);
        const totalSupplyBefore = await pusdv3.totalSupply();
        await pusdv3.connect(user1).redeem(redeemAmount, "USD");
        const userBalanceAfter2 = await pusdv3.balanceOf(user1.address);
        const totalSupplyAfter = await pusdv3.totalSupply();
        expect(userBalanceAfter2).to.equal(userBalanceBefore2 - redeemAmount);
        expect(totalSupplyAfter).to.equal(totalSupplyBefore - redeemAmount);
        console.log("   ✅ Redeem successful");
      });
    });

    describe("Blacklisted Owner Operations", function () {
      it("Should block blacklisted owner from performing token operations (mint, transfer, redeem)", async function () {
        // Ensure contract is unpaused
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // Blacklist the owner
        console.log("   Owner blacklisting themselves...");
        await pusdv3.blacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.true;
        console.log("   ✅ Owner blacklisted");

        const mintAmount = ethers.parseUnits("100", 6);
        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // Owner should not be able to mint
        console.log("   Owner attempting to mint while blacklisted...");
        await expect(pusdv3.mint(owner.address, mintAmount)).to.be.revertedWith(
          "Recipient blacklisted"
        );
        console.log("   ✅ Mint blocked as expected");

        // Owner should not be able to transfer
        if (addr1) {
          console.log("   Owner attempting to transfer while blacklisted...");
          await expect(
            pusdv3.transfer(addr1.address, transferAmount)
          ).to.be.revertedWith("Sender blacklisted");
          console.log("   ✅ Transfer blocked as expected");
        }

        // Owner should not be able to redeem
        console.log("   Owner attempting to redeem while blacklisted...");
        await expect(pusdv3.redeem(redeemAmount, "USD")).to.be.revertedWith(
          "Sender blacklisted"
        );
        console.log("   ✅ Redeem blocked as expected");

        // Cleanup: Owner can unblacklist themselves because unblacklist() only checks ownership
        console.log(
          "   Unblacklisting owner (unblacklist() only checks ownership)..."
        );
        await pusdv3.unblacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.false;
        console.log("   ✅ Owner unblacklisted (cleanup successful)");
      });

      it("Should allow blacklisted owner to perform ownership functions (pause, unpause, blacklist, unblacklist)", async function () {
        // Ensure contract is unpaused
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // Blacklist the owner
        console.log("   Owner blacklisting themselves...");
        await pusdv3.blacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.true;
        console.log("   ✅ Owner blacklisted");

        // Owner should still be able to pause (only checks ownership, not blacklist)
        console.log(
          "   Testing pause() - should still work (only checks ownership)..."
        );
        const wasPaused = await pusdv3.paused();
        if (!wasPaused) {
          await pusdv3.pause();
          expect(await pusdv3.paused()).to.be.true;
          console.log(
            "   ✅ Pause successful (contract design - pause() only checks ownership)"
          );
          await pusdv3.unpause();
        }

        // Owner should still be able to blacklist/unblacklist (only checks ownership)
        if (addr1) {
          console.log(
            "   Testing blacklist() - should still work (only checks ownership)..."
          );
          const wasBlacklisted = await pusdv3.blacklisted(addr1.address);
          if (!wasBlacklisted) {
            await pusdv3.blacklist(addr1.address);
            expect(await pusdv3.blacklisted(addr1.address)).to.be.true;
            await pusdv3.unblacklist(addr1.address);
            expect(await pusdv3.blacklisted(addr1.address)).to.be.false;
            console.log(
              "   ✅ Blacklist/unblacklist successful (contract design - only checks ownership)"
            );
          }
        }

        // Cleanup: unblacklist owner
        await pusdv3.unblacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.false;
        console.log("   ✅ Owner unblacklisted (cleanup)");
      });

      it("Should allow unblacklisted owner to perform all operations", async function () {
        // Ensure contract is unpaused
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // First blacklist the owner
        if (!(await pusdv3.blacklisted(owner.address))) {
          console.log("   Blacklisting owner first...");
          await pusdv3.blacklist(owner.address);
        }

        // Now unblacklist the owner
        console.log("   Unblacklisting owner...");
        await pusdv3.unblacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.false;
        console.log("   ✅ Owner unblacklisted");

        const mintAmount = ethers.parseUnits("100", 6);
        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // Owner should be able to mint
        console.log("   Owner minting tokens...");
        const balanceBefore = await pusdv3.balanceOf(owner.address);
        await pusdv3.mint(owner.address, mintAmount);
        const balanceAfter = await pusdv3.balanceOf(owner.address);
        expect(balanceAfter).to.equal(balanceBefore + mintAmount);
        console.log("   ✅ Mint successful");

        // Owner should be able to transfer
        if (addr1) {
          console.log("   Owner transferring tokens...");
          const ownerBalanceBefore = await pusdv3.balanceOf(owner.address);
          const userBalanceBefore = await pusdv3.balanceOf(addr1.address);
          await pusdv3.transfer(addr1.address, transferAmount);
          const ownerBalanceAfter = await pusdv3.balanceOf(owner.address);
          const userBalanceAfter = await pusdv3.balanceOf(addr1.address);
          expect(ownerBalanceAfter).to.equal(
            ownerBalanceBefore - transferAmount
          );
          expect(userBalanceAfter).to.equal(userBalanceBefore + transferAmount);
          console.log("   ✅ Transfer successful");
        }

        // Owner should be able to redeem
        console.log("   Owner redeeming tokens...");
        const ownerBalanceBefore2 = await pusdv3.balanceOf(owner.address);
        const totalSupplyBefore = await pusdv3.totalSupply();
        await pusdv3.redeem(redeemAmount, "USD");
        const ownerBalanceAfter2 = await pusdv3.balanceOf(owner.address);
        const totalSupplyAfter = await pusdv3.totalSupply();
        expect(ownerBalanceAfter2).to.equal(ownerBalanceBefore2 - redeemAmount);
        expect(totalSupplyAfter).to.equal(totalSupplyBefore - redeemAmount);
        console.log("   ✅ Redeem successful");

        // Owner should be able to pause/unpause
        console.log("   Owner pausing contract...");
        await pusdv3.pause();
        expect(await pusdv3.paused()).to.be.true;
        console.log("   ✅ Pause successful");

        console.log("   Owner unpausing contract...");
        await pusdv3.unpause();
        expect(await pusdv3.paused()).to.be.false;
        console.log("   ✅ Unpause successful");

        // Owner should be able to blacklist/unblacklist
        if (addr1) {
          console.log("   Owner blacklisting/unblacklisting address...");
          await pusdv3.blacklist(addr1.address);
          expect(await pusdv3.blacklisted(addr1.address)).to.be.true;
          await pusdv3.unblacklist(addr1.address);
          expect(await pusdv3.blacklisted(addr1.address)).to.be.false;
          console.log("   ✅ Blacklist/unblacklist successful");
        }
      });
    });

    describe("Operations TO Blacklisted Addresses", function () {
      it("Should block transfers to blacklisted addresses from any sender", async function () {
        if (!addr1 || !addr2) {
          this.skip();
        }

        // Ensure contract is unpaused
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // Ensure user1 is blacklisted
        if (!(await pusdv3.blacklisted(addr1.address))) {
          await pusdv3.blacklist(addr1.address);
        }

        // Ensure user2 is not blacklisted
        if (await pusdv3.blacklisted(addr2.address)) {
          await pusdv3.unblacklist(addr2.address);
        }

        const transferAmount = ethers.parseUnits("10", 6);

        // Owner should not be able to transfer TO blacklisted user1
        console.log("   Owner attempting to transfer TO blacklisted user1...");
        await expect(
          pusdv3.transfer(addr1.address, transferAmount)
        ).to.be.revertedWith("Recipient blacklisted");
        console.log("   ✅ Owner transfer to user1 blocked as expected");

        // Give user2 some tokens first
        await pusdv3.transfer(addr2.address, transferAmount);

        // User2 should not be able to transfer TO blacklisted user1
        console.log("   User2 attempting to transfer TO blacklisted user1...");
        await expect(
          pusdv3.connect(addr2).transfer(addr1.address, transferAmount)
        ).to.be.revertedWith("Recipient blacklisted");
        console.log("   ✅ User2 transfer to user1 blocked as expected");

        // Cleanup: unblacklist user1
        await pusdv3.unblacklist(addr1.address);
        console.log("   ✅ User1 unblacklisted (cleanup)");
      });

      it("Should block minting to blacklisted addresses", async function () {
        if (!addr1) {
          this.skip();
        }
        const user1 = addr1!; // Non-null assertion after skip check

        // Ensure contract is unpaused
        const pausedBefore = await pusdv3.paused();
        if (pausedBefore) {
          await pusdv3.unpause();
        }

        // Ensure user1 is blacklisted
        if (!(await pusdv3.blacklisted(user1.address))) {
          await pusdv3.blacklist(user1.address);
        }

        const mintAmount = ethers.parseUnits("100", 6);

        // Owner should not be able to mint TO blacklisted user1
        console.log("   Owner attempting to mint TO blacklisted user1...");
        await expect(pusdv3.mint(user1.address, mintAmount)).to.be.revertedWith(
          "Recipient blacklisted"
        );
        console.log("   ✅ Mint to user1 blocked as expected");

        // Cleanup: unblacklist user1
        await pusdv3.unblacklist(user1.address);
        console.log("   ✅ User1 unblacklisted (cleanup)");
      });
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
