import { expect } from "chai";
import { ethers } from "hardhat";
import { PUSDv2 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PUSDv2 Stablecoin", function () {
  let pusdv2: PUSDv2;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 6); // 1M PUSD with 6 decimals

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy PUSDv2 contract
    const PUSDv2Factory = await ethers.getContractFactory("PUSDv2");
    pusdv2 = await PUSDv2Factory.deploy();
    await pusdv2.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await pusdv2.name()).to.equal("Pegged USDv2");
      expect(await pusdv2.symbol()).to.equal("PUSDv2");
    });

    it("Should have 6 decimals", async function () {
      expect(await pusdv2.decimals()).to.equal(6);
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await pusdv2.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set total supply to 1 million PUSD", async function () {
      const totalSupply = await pusdv2.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the right owner", async function () {
      expect(await pusdv2.owner()).to.equal(owner.address);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("100", 6);

      // Transfer from owner to addr1
      await pusdv2.transfer(addr1.address, transferAmount);
      expect(await pusdv2.balanceOf(addr1.address)).to.equal(transferAmount);

      // Transfer from addr1 to addr2
      await pusdv2.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await pusdv2.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await pusdv2.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await pusdv2.balanceOf(owner.address);
      const excessAmount = initialOwnerBalance + 1n;

      await expect(
        pusdv2.connect(addr1).transfer(owner.address, excessAmount)
      ).to.be.reverted;
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await pusdv2.balanceOf(owner.address);
      const transferAmount = ethers.parseUnits("100", 6);

      await pusdv2.transfer(addr1.address, transferAmount);
      await pusdv2.transfer(addr2.address, transferAmount);

      const finalOwnerBalance = await pusdv2.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - transferAmount * 2n);

      expect(await pusdv2.balanceOf(addr1.address)).to.equal(transferAmount);
      expect(await pusdv2.balanceOf(addr2.address)).to.equal(transferAmount);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const mintAmount = ethers.parseUnits("500000", 6);
      await pusdv2.mint(addr1.address, mintAmount);

      expect(await pusdv2.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await pusdv2.totalSupply()).to.equal(INITIAL_SUPPLY + mintAmount);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.parseUnits("100", 6);
      
      await expect(
        pusdv2.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.reverted;
    });

    it("Should emit Transfer event when minting", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      
      await expect(pusdv2.mint(addr1.address, mintAmount))
        .to.emit(pusdv2, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);
    });
  });

  describe("Redeem Function (v2 Feature)", function () {
    beforeEach(async function () {
      // Give addr1 some tokens to redeem
      const mintAmount = ethers.parseUnits("1000", 6);
      await pusdv2.mint(addr1.address, mintAmount);
    });

    it("Should burn tokens and emit Redeemed event for USD", async function () {
      const redeemAmount = ethers.parseUnits("100", 6);
      const initialBalance = await pusdv2.balanceOf(addr1.address);
      const initialSupply = await pusdv2.totalSupply();

      await expect(pusdv2.connect(addr1).redeem(redeemAmount, "USD"))
        .to.emit(pusdv2, "Redeemed")
        .withArgs(addr1.address, redeemAmount, "USD");

      // Check balance decreased
      const finalBalance = await pusdv2.balanceOf(addr1.address);
      expect(finalBalance).to.equal(initialBalance - redeemAmount);

      // Check total supply decreased
      const finalSupply = await pusdv2.totalSupply();
      expect(finalSupply).to.equal(initialSupply - redeemAmount);
    });

    it("Should support multiple currencies (EUR, GBP)", async function () {
      const amount = ethers.parseUnits("50", 6);

      await expect(pusdv2.connect(addr1).redeem(amount, "EUR"))
        .to.emit(pusdv2, "Redeemed")
        .withArgs(addr1.address, amount, "EUR");

      await expect(pusdv2.connect(addr1).redeem(amount, "GBP"))
        .to.emit(pusdv2, "Redeemed")
        .withArgs(addr1.address, amount, "GBP");
    });

    it("Should fail if user doesn't have enough tokens to redeem", async function () {
      const excessAmount = ethers.parseUnits("2000", 6); // More than they have

      await expect(
        pusdv2.connect(addr1).redeem(excessAmount, "USD")
      ).to.be.reverted;
    });

    it("Should emit Transfer event when burning", async function () {
      const redeemAmount = ethers.parseUnits("100", 6);

      await expect(pusdv2.connect(addr1).redeem(redeemAmount, "USD"))
        .to.emit(pusdv2, "Transfer")
        .withArgs(addr1.address, ethers.ZeroAddress, redeemAmount);
    });

    it("Should allow redeeming entire balance", async function () {
      const balance = await pusdv2.balanceOf(addr1.address);

      await expect(pusdv2.connect(addr1).redeem(balance, "USD"))
        .to.emit(pusdv2, "Redeemed")
        .withArgs(addr1.address, balance, "USD");

      expect(await pusdv2.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should track multiple redemptions correctly", async function () {
      const amount1 = ethers.parseUnits("100", 6);
      const amount2 = ethers.parseUnits("50", 6);
      const initialBalance = await pusdv2.balanceOf(addr1.address);

      await pusdv2.connect(addr1).redeem(amount1, "USD");
      await pusdv2.connect(addr1).redeem(amount2, "EUR");

      const finalBalance = await pusdv2.balanceOf(addr1.address);
      expect(finalBalance).to.equal(initialBalance - amount1 - amount2);
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await pusdv2.transferOwnership(addr1.address);
      expect(await pusdv2.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      await expect(
        pusdv2.connect(addr1).transferOwnership(addr2.address)
      ).to.be.reverted;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero transfers", async function () {
      await expect(pusdv2.transfer(addr1.address, 0)).to.not.be.reverted;
    });

    it("Should handle transfer to self", async function () {
      const amount = ethers.parseUnits("100", 6);
      await expect(pusdv2.transfer(owner.address, amount)).to.not.be.reverted;
    });

    it("Should handle zero amount redemption", async function () {
      await expect(pusdv2.redeem(0, "USD")).to.not.be.reverted;
    });
  });
});

