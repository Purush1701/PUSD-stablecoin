import { ethers } from "hardhat";
import deploymentInfo from "../deployments/sepolia-v3.json";

async function main() {
  console.log("🔗 Connecting to PUSDv3 on Sepolia...\n");

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log("Connected with account:", signer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(signer.address)),
    "ETH\n"
  );

  // Connect to the deployed contract
  const PUSDv3 = await ethers.getContractFactory("PUSDv3");
  const pusdv3 = PUSDv3.attach(deploymentInfo.address);

  console.log("📊 Contract Address:", deploymentInfo.address);
  console.log("🔗 Etherscan:", deploymentInfo.etherscanUrl);
  console.log("\n" + "=".repeat(60) + "\n");

  // ========== READ CONTRACT STATE ==========
  console.log("📖 Reading Current Contract State:\n");

  const name = await pusdv3.name();
  const symbol = await pusdv3.symbol();
  const decimals = await pusdv3.decimals();
  const totalSupply = await pusdv3.totalSupply();
  const maxSupply = await pusdv3.MAX_SUPPLY();
  const owner = await pusdv3.owner();
  const paused = await pusdv3.paused();
  const balance = await pusdv3.balanceOf(signer.address);

  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals.toString());
  console.log(
    "   Total Supply:",
    ethers.formatUnits(totalSupply, decimals),
    symbol
  );
  console.log(
    "   Max Supply:",
    ethers.formatUnits(maxSupply, decimals),
    symbol
  );
  console.log("   Owner:", owner);
  console.log("   Paused:", paused);
  console.log(
    "   Your Balance:",
    ethers.formatUnits(balance, decimals),
    symbol
  );

  console.log("\n" + "=".repeat(60) + "\n");

  // ========== INTERACTIVE MENU ==========
  console.log("🧪 Available Test Functions:\n");
  console.log("Uncomment the function you want to test below:\n");

  // ========== MINT TOKENS ==========
  // const mintAmount = ethers.parseUnits("1000", decimals);
  // console.log("🪙 Minting", ethers.formatUnits(mintAmount, decimals), symbol, "...");
  // const mintTx = await pusdv3.mint(signer.address, mintAmount);
  // await mintTx.wait();
  // console.log("✅ Minted! Tx:", mintTx.hash);
  // const newBalance = await pusdv3.balanceOf(signer.address);
  // console.log("   New Balance:", ethers.formatUnits(newBalance, decimals), symbol);

  // ========== TRANSFER TOKENS ==========
  // const recipient = "0xRecipientAddressHere";
  // const transferAmount = ethers.parseUnits("100", decimals);
  // console.log("💸 Transferring", ethers.formatUnits(transferAmount, decimals), symbol, "to", recipient, "...");
  // const transferTx = await pusdv3.transfer(recipient, transferAmount);
  // await transferTx.wait();
  // console.log("✅ Transferred! Tx:", transferTx.hash);

  // ========== BURN TOKENS ==========
  // const burnAmount = ethers.parseUnits("50", decimals);
  // console.log("🔥 Burning", ethers.formatUnits(burnAmount, decimals), symbol, "...");
  // const burnTx = await pusdv3.burn(burnAmount);
  // await burnTx.wait();
  // console.log("✅ Burned! Tx:", burnTx.hash);

  // ========== REDEEM TOKENS ==========
  // const redeemAmount = ethers.parseUnits("25", decimals);
  // console.log("🔄 Redeeming", ethers.formatUnits(redeemAmount, decimals), symbol, "...");
  // const redeemTx = await pusdv3.redeem(redeemAmount);
  // await redeemTx.wait();
  // console.log("✅ Redeemed! Tx:", redeemTx.hash);

  // ========== PAUSE CONTRACT ==========
  // console.log("⏸️  Pausing contract...");
  // const pauseTx = await pusdv3.pause();
  // await pauseTx.wait();
  // console.log("✅ Contract paused! Tx:", pauseTx.hash);

  // ========== UNPAUSE CONTRACT ==========
  // console.log("▶️  Unpausing contract...");
  // const unpauseTx = await pusdv3.unpause();
  // await unpauseTx.wait();
  // console.log("✅ Contract unpaused! Tx:", unpauseTx.hash);

  // ========== BLACKLIST ADDRESS ==========
  // const addressToBlacklist = "0xAddressToBlacklistHere";
  // console.log("🚫 Blacklisting address:", addressToBlacklist);
  // const blacklistTx = await pusdv3.blacklist(addressToBlacklist);
  // await blacklistTx.wait();
  // console.log("✅ Address blacklisted! Tx:", blacklistTx.hash);

  // ========== UNBLACKLIST ADDRESS ==========
  // const addressToUnblacklist = "0xAddressToUnblacklistHere";
  // console.log("✅ Unblacklisting address:", addressToUnblacklist);
  // const unblacklistTx = await pusdv3.unblacklist(addressToUnblacklist);
  // await unblacklistTx.wait();
  // console.log("✅ Address unblacklisted! Tx:", unblacklistTx.hash);

  // ========== CHECK IF ADDRESS IS BLACKLISTED ==========
  // const addressToCheck = "0xAddressToCheckHere";
  // const isBlacklisted = await pusdv3.isBlacklisted(addressToCheck);
  // console.log("Address", addressToCheck, "blacklisted:", isBlacklisted);

  // ========== TRANSFER OWNERSHIP ==========
  // const newOwner = "0xNewOwnerAddressHere";
  // console.log("👑 Transferring ownership to:", newOwner);
  // const transferOwnershipTx = await pusdv3.transferOwnership(newOwner);
  // await transferOwnershipTx.wait();
  // console.log("✅ Ownership transferred! Tx:", transferOwnershipTx.hash);

  console.log("\n✨ Done! Modify this script to test specific functions.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
