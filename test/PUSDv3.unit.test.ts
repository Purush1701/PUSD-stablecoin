// CI/CD Test: This commit includes a deliberately failing test to verify the GitHub Actions workflow
// correctly blocks merges/pushes when tests fail. The test "Should have 6 decimals" is modified to fail.
import { expect } from "chai";
import { ethers } from "hardhat";
import { PUSDv3 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PUSDv3 Stablecoin", function () {
  let pusdv3: PUSDv3;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 6); // 1M PUSD
  const MAX_SUPPLY = ethers.parseUnits("100000000", 6); // 100M PUSD

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const PUSDv3Factory = await ethers.getContractFactory("PUSDv3");
    pusdv3 = (await PUSDv3Factory.deploy()) as unknown as PUSDv3;
    await pusdv3.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await pusdv3.name()).to.equal("Pegged USDv3");
      expect(await pusdv3.symbol()).to.equal("PUSDv3");
    });

    it("Should have 6 decimals", async function () {
      // DELIBERATE FAILURE FOR CI TESTING - This test will fail to verify CI pipeline blocks on test failures
      expect(await pusdv3.decimals()).to.equal(7); // Changed from 6 to 7 to make test fail
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await pusdv3.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set correct max supply", async function () {
      // CI BLOCKING DEMO: This test is deliberately failing to demonstrate branch protection
      // The PR merge should be blocked until this test passes
      expect(await pusdv3.MAX_SUPPLY()).to.equal(ethers.parseUnits("99999999", 6)); // Wrong value to make test fail
    });

    it("Should not be paused initially", async function () {
      expect(await pusdv3.paused()).to.be.false;
    });

    it("Should set the right owner", async function () {
      expect(await pusdv3.owner()).to.equal(owner.address);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("100", 6);

      await pusdv3.transfer(addr1.address, transferAmount);
      expect(await pusdv3.balanceOf(addr1.address)).to.equal(transferAmount);

      await pusdv3.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await pusdv3.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await pusdv3.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await pusdv3.balanceOf(owner.address);
      const excessAmount = initialOwnerBalance + 1n;

      await expect(pusdv3.connect(addr1).transfer(owner.address, excessAmount))
        .to.be.reverted;
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const mintAmount = ethers.parseUnits("500000", 6);
      await pusdv3.mint(addr1.address, mintAmount);

      expect(await pusdv3.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await pusdv3.totalSupply()).to.equal(INITIAL_SUPPLY + mintAmount);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.parseUnits("100", 6);

      await expect(pusdv3.connect(addr1).mint(addr2.address, mintAmount)).to.be
        .reverted;
    });

    it("Should not allow minting beyond max supply", async function () {
      const excessAmount = MAX_SUPPLY; // Would exceed 100M total

      await expect(pusdv3.mint(addr1.address, excessAmount)).to.be.revertedWith(
        "Exceeds max supply"
      );
    });

    it("Should not allow minting to blacklisted address", async function () {
      await pusdv3.blacklist(addr1.address);
      const mintAmount = ethers.parseUnits("100", 6);

      await expect(pusdv3.mint(addr1.address, mintAmount)).to.be.revertedWith(
        "Recipient blacklisted"
      );
    });
  });

  describe("Redeem Function (v2 Feature)", function () {
    beforeEach(async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      await pusdv3.mint(addr1.address, mintAmount);
    });

    it("Should burn tokens and emit Redeemed event", async function () {
      const redeemAmount = ethers.parseUnits("100", 6);
      const initialBalance = await pusdv3.balanceOf(addr1.address);
      const initialSupply = await pusdv3.totalSupply();

      await expect(pusdv3.connect(addr1).redeem(redeemAmount, "USD"))
        .to.emit(pusdv3, "Redeemed")
        .withArgs(addr1.address, redeemAmount, "USD");

      const finalBalance = await pusdv3.balanceOf(addr1.address);
      expect(finalBalance).to.equal(initialBalance - redeemAmount);

      const finalSupply = await pusdv3.totalSupply();
      expect(finalSupply).to.equal(initialSupply - redeemAmount);
    });

    it("Should support multiple currencies", async function () {
      const amount = ethers.parseUnits("50", 6);

      await expect(pusdv3.connect(addr1).redeem(amount, "EUR"))
        .to.emit(pusdv3, "Redeemed")
        .withArgs(addr1.address, amount, "EUR");
    });

    it("Should not allow redeem when paused", async function () {
      await pusdv3.pause();
      const redeemAmount = ethers.parseUnits("100", 6);

      await expect(
        pusdv3.connect(addr1).redeem(redeemAmount, "USD")
      ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
    });

    it("Should not allow blacklisted user to redeem", async function () {
      await pusdv3.blacklist(addr1.address);
      const redeemAmount = ethers.parseUnits("100", 6);

      await expect(
        pusdv3.connect(addr1).redeem(redeemAmount, "USD")
      ).to.be.revertedWith("Sender blacklisted");
    });
  });

  describe("Pause Functionality (v3 Feature)", function () {
    it("Should allow owner to pause", async function () {
      await pusdv3.pause();
      expect(await pusdv3.paused()).to.be.true;
    });

    it("Should allow owner to unpause", async function () {
      await pusdv3.pause();
      await pusdv3.unpause();
      expect(await pusdv3.paused()).to.be.false;
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(pusdv3.connect(addr1).pause()).to.be.reverted;
    });

    it("Should not allow non-owner to unpause", async function () {
      await pusdv3.pause();
      await expect(pusdv3.connect(addr1).unpause()).to.be.reverted;
    });

    it("Should block transfers when paused", async function () {
      await pusdv3.transfer(addr1.address, ethers.parseUnits("100", 6));

      await pusdv3.pause();

      await expect(
        pusdv3
          .connect(addr1)
          .transfer(addr2.address, ethers.parseUnits("10", 6))
      ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
    });

    it("Should allow transfers after unpause", async function () {
      await pusdv3.transfer(addr1.address, ethers.parseUnits("100", 6));
      await pusdv3.pause();
      await pusdv3.unpause();

      await expect(
        pusdv3
          .connect(addr1)
          .transfer(addr2.address, ethers.parseUnits("10", 6))
      ).to.not.be.reverted;
    });

    it("Should block minting when paused", async function () {
      await pusdv3.pause();

      await expect(
        pusdv3.mint(addr1.address, ethers.parseUnits("100", 6))
      ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
    });
  });

  describe("Blacklist Functionality (v3 Feature)", function () {
    it("Should allow owner to blacklist address", async function () {
      await expect(pusdv3.blacklist(addr1.address))
        .to.emit(pusdv3, "Blacklisted")
        .withArgs(addr1.address);

      expect(await pusdv3.blacklisted(addr1.address)).to.be.true;
    });

    it("Should allow owner to unblacklist address", async function () {
      await pusdv3.blacklist(addr1.address);

      await expect(pusdv3.unblacklist(addr1.address))
        .to.emit(pusdv3, "Unblacklisted")
        .withArgs(addr1.address);

      expect(await pusdv3.blacklisted(addr1.address)).to.be.false;
    });

    it("Should not allow blacklisting zero address", async function () {
      await expect(pusdv3.blacklist(ethers.ZeroAddress)).to.be.revertedWith(
        "Zero address"
      );
    });

    it("Should not allow non-owner to blacklist", async function () {
      await expect(pusdv3.connect(addr1).blacklist(addr2.address)).to.be
        .reverted;
    });

    it("Should block blacklisted sender from transferring", async function () {
      await pusdv3.transfer(addr1.address, ethers.parseUnits("100", 6));
      await pusdv3.blacklist(addr1.address);

      await expect(
        pusdv3
          .connect(addr1)
          .transfer(addr2.address, ethers.parseUnits("10", 6))
      ).to.be.revertedWith("Sender blacklisted");
    });

    it("Should block transfers to blacklisted recipient", async function () {
      await pusdv3.blacklist(addr1.address);

      await expect(
        pusdv3.transfer(addr1.address, ethers.parseUnits("100", 6))
      ).to.be.revertedWith("Recipient blacklisted");
    });

    it("Should allow transfers after unblacklisting", async function () {
      await pusdv3.transfer(addr1.address, ethers.parseUnits("100", 6));
      await pusdv3.blacklist(addr1.address);
      await pusdv3.unblacklist(addr1.address);

      await expect(
        pusdv3
          .connect(addr1)
          .transfer(addr2.address, ethers.parseUnits("10", 6))
      ).to.not.be.reverted;
    });
  });

  describe("Combined Security Features", function () {
    it("Should block blacklisted user even when not paused", async function () {
      await pusdv3.transfer(addr1.address, ethers.parseUnits("100", 6));
      await pusdv3.blacklist(addr1.address);

      await expect(
        pusdv3
          .connect(addr1)
          .transfer(addr2.address, ethers.parseUnits("10", 6))
      ).to.be.revertedWith("Sender blacklisted");
    });

    it("Should block all transfers when paused, even for non-blacklisted", async function () {
      await pusdv3.transfer(addr1.address, ethers.parseUnits("100", 6));
      await pusdv3.pause();

      await expect(
        pusdv3
          .connect(addr1)
          .transfer(addr2.address, ethers.parseUnits("10", 6))
      ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
    });

    it("Should enforce both pause and blacklist on redeem", async function () {
      await pusdv3.mint(addr1.address, ethers.parseUnits("100", 6));
      await pusdv3.blacklist(addr1.address);
      await pusdv3.pause();

      // Blacklist check happens first
      await expect(
        pusdv3.connect(addr1).redeem(ethers.parseUnits("10", 6), "USD")
      ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");
    });
  });

  describe("Max Supply Cap", function () {
    it("Should track total supply correctly", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      await pusdv3.mint(addr1.address, mintAmount);

      expect(await pusdv3.totalSupply()).to.equal(INITIAL_SUPPLY + mintAmount);
    });

    it("Should enforce max supply on large mints", async function () {
      const largeAmount = MAX_SUPPLY - INITIAL_SUPPLY + 1n;

      await expect(pusdv3.mint(addr1.address, largeAmount)).to.be.revertedWith(
        "Exceeds max supply"
      );
    });

    it("Should allow minting up to max supply", async function () {
      const allowedAmount = MAX_SUPPLY - INITIAL_SUPPLY;

      await expect(pusdv3.mint(addr1.address, allowedAmount)).to.not.be
        .reverted;

      expect(await pusdv3.totalSupply()).to.equal(MAX_SUPPLY);
    });

    it("Should not allow any minting when at max supply", async function () {
      const allowedAmount = MAX_SUPPLY - INITIAL_SUPPLY;
      await pusdv3.mint(addr1.address, allowedAmount);

      await expect(pusdv3.mint(addr2.address, 1n)).to.be.revertedWith(
        "Exceeds max supply"
      );
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await pusdv3.transferOwnership(addr1.address);
      expect(await pusdv3.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      await expect(pusdv3.connect(addr1).transferOwnership(addr2.address)).to.be
        .reverted;
    });

    it("Should allow new owner to use admin functions", async function () {
      await pusdv3.transferOwnership(addr1.address);

      await expect(pusdv3.connect(addr1).pause()).to.not.be.reverted;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero transfers", async function () {
      await expect(pusdv3.transfer(addr1.address, 0)).to.not.be.reverted;
    });

    it("Should handle zero redeem", async function () {
      await expect(pusdv3.redeem(0, "USD")).to.not.be.reverted;
    });

    it("Should handle multiple blacklist operations", async function () {
      await pusdv3.blacklist(addr1.address);
      await pusdv3.blacklist(addr1.address); // Should not fail
      expect(await pusdv3.blacklisted(addr1.address)).to.be.true;
    });

    it("Should handle multiple pause/unpause cycles", async function () {
      await pusdv3.pause();
      await pusdv3.unpause();
      await pusdv3.pause();
      await pusdv3.unpause();
      expect(await pusdv3.paused()).to.be.false;
    });
  });

  describe("Negative Test Cases", function () {
    describe("Pause/Unpause Access Control", function () {
      it("Should not allow non-owner to pause the contract", async function () {
        await expect(pusdv3.connect(addr1).pause()).to.be.reverted;
      });

      it("Should not allow non-owner to unpause the contract", async function () {
        await pusdv3.pause();
        await expect(pusdv3.connect(addr1).unpause()).to.be.reverted;
        await pusdv3.unpause(); // Cleanup
      });
    });

    describe("Operations When Contract is Paused", function () {
      it("Should block owner from performing mint, transfer, and redeem when paused", async function () {
        await pusdv3.pause();
        expect(await pusdv3.paused()).to.be.true;

        const mintAmount = ethers.parseUnits("100", 6);
        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // Owner should not be able to mint when paused
        await expect(
          pusdv3.mint(owner.address, mintAmount)
        ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");

        // Owner should not be able to transfer when paused
        await expect(
          pusdv3.transfer(addr1.address, transferAmount)
        ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");

        // Owner should not be able to redeem when paused
        await expect(
          pusdv3.redeem(redeemAmount, "USD")
        ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");

        // Cleanup: unpause
        await pusdv3.unpause();
      });

      it("Should block users from performing transfer and redeem when paused", async function () {
        // Give user some tokens first
        const initialAmount = ethers.parseUnits("100", 6);
        await pusdv3.transfer(addr1.address, initialAmount);

        // Pause the contract
        await pusdv3.pause();

        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // User should not be able to transfer when paused
        await expect(
          pusdv3.connect(addr1).transfer(owner.address, transferAmount)
        ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");

        // User should not be able to redeem when paused
        await expect(
          pusdv3.connect(addr1).redeem(redeemAmount, "USD")
        ).to.be.revertedWithCustomError(pusdv3, "EnforcedPause");

        // Cleanup: unpause
        await pusdv3.unpause();
      });
    });

    describe("Blacklisted Owner Operations", function () {
      it("Should block blacklisted owner from performing token operations (mint, transfer, redeem)", async function () {
        // Blacklist the owner
        await pusdv3.blacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.true;

        const mintAmount = ethers.parseUnits("100", 6);
        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // Owner should not be able to mint
        await expect(pusdv3.mint(owner.address, mintAmount)).to.be.revertedWith(
          "Recipient blacklisted"
        );

        // Owner should not be able to transfer
        await expect(
          pusdv3.transfer(addr1.address, transferAmount)
        ).to.be.revertedWith("Sender blacklisted");

        // Owner should not be able to redeem
        await expect(pusdv3.redeem(redeemAmount, "USD")).to.be.revertedWith(
          "Sender blacklisted"
        );

        // Cleanup: Owner can unblacklist themselves because unblacklist() only checks ownership
        await pusdv3.unblacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.false;
      });

      it("Should allow blacklisted owner to perform ownership functions (pause, unpause, blacklist, unblacklist)", async function () {
        // Blacklist the owner
        await pusdv3.blacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.true;

        // Owner should still be able to pause (only checks ownership, not blacklist)
        const wasPaused = await pusdv3.paused();
        if (!wasPaused) {
          await pusdv3.pause();
          expect(await pusdv3.paused()).to.be.true;
          await pusdv3.unpause();
        }

        // Owner should still be able to blacklist/unblacklist (only checks ownership)
        const wasBlacklisted = await pusdv3.blacklisted(addr1.address);
        if (!wasBlacklisted) {
          await pusdv3.blacklist(addr1.address);
          expect(await pusdv3.blacklisted(addr1.address)).to.be.true;
          await pusdv3.unblacklist(addr1.address);
          expect(await pusdv3.blacklisted(addr1.address)).to.be.false;
        }

        // Cleanup: unblacklist owner
        await pusdv3.unblacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.false;
      });

      it("Should allow unblacklisted owner to perform all operations", async function () {
        // First blacklist the owner
        await pusdv3.blacklist(owner.address);

        // Now unblacklist the owner
        await pusdv3.unblacklist(owner.address);
        expect(await pusdv3.blacklisted(owner.address)).to.be.false;

        const mintAmount = ethers.parseUnits("100", 6);
        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // Owner should be able to mint
        const balanceBefore = await pusdv3.balanceOf(owner.address);
        await pusdv3.mint(owner.address, mintAmount);
        const balanceAfter = await pusdv3.balanceOf(owner.address);
        expect(balanceAfter).to.equal(balanceBefore + mintAmount);

        // Owner should be able to transfer
        const ownerBalanceBefore = await pusdv3.balanceOf(owner.address);
        const userBalanceBefore = await pusdv3.balanceOf(addr1.address);
        await pusdv3.transfer(addr1.address, transferAmount);
        const ownerBalanceAfter = await pusdv3.balanceOf(owner.address);
        const userBalanceAfter = await pusdv3.balanceOf(addr1.address);
        expect(ownerBalanceAfter).to.equal(ownerBalanceBefore - transferAmount);
        expect(userBalanceAfter).to.equal(userBalanceBefore + transferAmount);

        // Owner should be able to redeem
        const ownerBalanceBefore2 = await pusdv3.balanceOf(owner.address);
        const totalSupplyBefore = await pusdv3.totalSupply();
        await pusdv3.redeem(redeemAmount, "USD");
        const ownerBalanceAfter2 = await pusdv3.balanceOf(owner.address);
        const totalSupplyAfter = await pusdv3.totalSupply();
        expect(ownerBalanceAfter2).to.equal(ownerBalanceBefore2 - redeemAmount);
        expect(totalSupplyAfter).to.equal(totalSupplyBefore - redeemAmount);

        // Owner should be able to pause/unpause
        await pusdv3.pause();
        expect(await pusdv3.paused()).to.be.true;
        await pusdv3.unpause();
        expect(await pusdv3.paused()).to.be.false;

        // Owner should be able to blacklist/unblacklist
        await pusdv3.blacklist(addr1.address);
        expect(await pusdv3.blacklisted(addr1.address)).to.be.true;
        await pusdv3.unblacklist(addr1.address);
        expect(await pusdv3.blacklisted(addr1.address)).to.be.false;
      });
    });

    describe("Blacklisted User Operations", function () {
      it("Should block blacklisted users from transferring tokens", async function () {
        // First, send some tokens to test address
        const amount = ethers.parseUnits("10", 6);
        await pusdv3.transfer(addr1.address, amount);

        // Blacklist the address
        await pusdv3.blacklist(addr1.address);

        // Try to transfer from blacklisted address
        await expect(
          pusdv3
            .connect(addr1)
            .transfer(owner.address, ethers.parseUnits("1", 6))
        ).to.be.revertedWith("Sender blacklisted");

        // Clean up
        await pusdv3.unblacklist(addr1.address);
      });

      it("Should block blacklisted users from redeeming tokens", async function () {
        // Give user1 some tokens
        const initialAmount = ethers.parseUnits("100", 6);
        await pusdv3.transfer(addr1.address, initialAmount);

        // Blacklist user1
        await pusdv3.blacklist(addr1.address);
        expect(await pusdv3.blacklisted(addr1.address)).to.be.true;

        const redeemAmount = ethers.parseUnits("5", 6);

        // User1 should not be able to redeem
        await expect(
          pusdv3.connect(addr1).redeem(redeemAmount, "USD")
        ).to.be.revertedWith("Sender blacklisted");

        // Cleanup: unblacklist user1
        await pusdv3.unblacklist(addr1.address);
      });

      it("Should allow unblacklisted users to transfer and redeem tokens", async function () {
        // Ensure user1 is blacklisted first
        await pusdv3.blacklist(addr1.address);

        // Unblacklist user1
        await pusdv3.unblacklist(addr1.address);
        expect(await pusdv3.blacklisted(addr1.address)).to.be.false;

        // Give user1 some tokens
        const initialAmount = ethers.parseUnits("100", 6);
        await pusdv3.transfer(addr1.address, initialAmount);

        const transferAmount = ethers.parseUnits("10", 6);
        const redeemAmount = ethers.parseUnits("5", 6);

        // User1 should be able to transfer
        const userBalanceBefore = await pusdv3.balanceOf(addr1.address);
        const ownerBalanceBefore = await pusdv3.balanceOf(owner.address);
        await pusdv3.connect(addr1).transfer(owner.address, transferAmount);
        const userBalanceAfter = await pusdv3.balanceOf(addr1.address);
        const ownerBalanceAfter = await pusdv3.balanceOf(owner.address);
        expect(userBalanceAfter).to.equal(userBalanceBefore - transferAmount);
        expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + transferAmount);

        // User1 should be able to redeem
        const userBalanceBefore2 = await pusdv3.balanceOf(addr1.address);
        const totalSupplyBefore = await pusdv3.totalSupply();
        await pusdv3.connect(addr1).redeem(redeemAmount, "USD");
        const userBalanceAfter2 = await pusdv3.balanceOf(addr1.address);
        const totalSupplyAfter = await pusdv3.totalSupply();
        expect(userBalanceAfter2).to.equal(userBalanceBefore2 - redeemAmount);
        expect(totalSupplyAfter).to.equal(totalSupplyBefore - redeemAmount);
      });
    });

    describe("Operations TO Blacklisted Addresses", function () {
      it("Should block transfers to blacklisted addresses from any sender", async function () {
        // Ensure user1 is blacklisted
        await pusdv3.blacklist(addr1.address);

        // Ensure user2 is not blacklisted
        if (await pusdv3.blacklisted(addr2.address)) {
          await pusdv3.unblacklist(addr2.address);
        }

        const transferAmount = ethers.parseUnits("10", 6);

        // Owner should not be able to transfer TO blacklisted user1
        await expect(
          pusdv3.transfer(addr1.address, transferAmount)
        ).to.be.revertedWith("Recipient blacklisted");

        // Give user2 some tokens first
        await pusdv3.transfer(addr2.address, transferAmount);

        // User2 should not be able to transfer TO blacklisted user1
        await expect(
          pusdv3.connect(addr2).transfer(addr1.address, transferAmount)
        ).to.be.revertedWith("Recipient blacklisted");

        // Cleanup: unblacklist user1
        await pusdv3.unblacklist(addr1.address);
      });

      it("Should block minting to blacklisted addresses", async function () {
        // Ensure user1 is blacklisted
        await pusdv3.blacklist(addr1.address);

        const mintAmount = ethers.parseUnits("100", 6);

        // Owner should not be able to mint TO blacklisted user1
        await expect(pusdv3.mint(addr1.address, mintAmount)).to.be.revertedWith(
          "Recipient blacklisted"
        );

        // Cleanup: unblacklist user1
        await pusdv3.unblacklist(addr1.address);
      });
    });
  });
});
