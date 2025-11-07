import { expect } from "chai";
import { ethers } from "hardhat";
import { PUSD } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PUSD Stablecoin", function () {
  let pusd: PUSD;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 6); // 1M PUSD with 6 decimals

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy PUSD contract
    const PUSDFactory = await ethers.getContractFactory("PUSD");
    pusd = await PUSDFactory.deploy();
    await pusd.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await pusd.name()).to.equal("Pegged USD");
      expect(await pusd.symbol()).to.equal("PUSD");
    });

    it("Should have 6 decimals", async function () {
      expect(await pusd.decimals()).to.equal(6);
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await pusd.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set total supply to 1 million PUSD", async function () {
      const totalSupply = await pusd.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the right owner", async function () {
      expect(await pusd.owner()).to.equal(owner.address);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("100", 6);

      // Transfer from owner to addr1
      await pusd.transfer(addr1.address, transferAmount);
      expect(await pusd.balanceOf(addr1.address)).to.equal(transferAmount);

      // Transfer from addr1 to addr2
      await pusd.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await pusd.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await pusd.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await pusd.balanceOf(owner.address);
      const excessAmount = initialOwnerBalance + 1n;

      await expect(
        pusd.connect(addr1).transfer(owner.address, excessAmount)
      ).to.be.reverted;
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await pusd.balanceOf(owner.address);
      const transferAmount = ethers.parseUnits("100", 6);

      await pusd.transfer(addr1.address, transferAmount);
      await pusd.transfer(addr2.address, transferAmount);

      const finalOwnerBalance = await pusd.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - transferAmount * 2n);

      expect(await pusd.balanceOf(addr1.address)).to.equal(transferAmount);
      expect(await pusd.balanceOf(addr2.address)).to.equal(transferAmount);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const mintAmount = ethers.parseUnits("500000", 6);
      await pusd.mint(addr1.address, mintAmount);

      expect(await pusd.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await pusd.totalSupply()).to.equal(INITIAL_SUPPLY + mintAmount);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.parseUnits("100", 6);
      
      await expect(
        pusd.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.reverted;
    });

    it("Should emit Transfer event when minting", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      
      await expect(pusd.mint(addr1.address, mintAmount))
        .to.emit(pusd, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await pusd.transferOwnership(addr1.address);
      expect(await pusd.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      await expect(
        pusd.connect(addr1).transferOwnership(addr2.address)
      ).to.be.reverted;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero transfers", async function () {
      await expect(pusd.transfer(addr1.address, 0)).to.not.be.reverted;
    });

    it("Should handle transfer to self", async function () {
      const amount = ethers.parseUnits("100", 6);
      await expect(pusd.transfer(owner.address, amount)).to.not.be.reverted;
    });
  });
});

