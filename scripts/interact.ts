import { ethers } from "hardhat";
import hre from "hardhat";

// Replace with your deployed contract address
const PUSD_ADDRESS = "0x2c31a9a9147bee127fb3fb07d14406c0ba8a75cc";

async function main() {
  console.log("🔗 Connecting to PUSD contract...\n");

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("Connected with account:", signer.address);

  // Connect to deployed contract
  const pusd = await ethers.getContractAt("PUSD", PUSD_ADDRESS);

  // Get contract details
  console.log("\n📊 Contract Information:");
  console.log("   Address:", await pusd.getAddress());
  console.log("   Name:", await pusd.name());
  console.log("   Symbol:", await pusd.symbol());
  console.log("   Decimals:", await pusd.decimals());
  
  const totalSupply = await pusd.totalSupply();
  console.log("   Total Supply:", ethers.formatUnits(totalSupply, 6), "PUSD");
  
  const balance = await pusd.balanceOf(signer.address);
  console.log("   Your Balance:", ethers.formatUnits(balance, 6), "PUSD");
  
  const owner = await pusd.owner();
  console.log("   Owner:", owner);
  console.log("   You are owner:", owner.toLowerCase() === signer.address.toLowerCase());

  // Example: Transfer tokens
  // Uncomment to execute:
  /*
  console.log("\n💸 Transferring 100 PUSD...");
  const recipientAddress = "0x..."; // Replace with recipient
  const amount = ethers.parseUnits("100", 6);
  const tx = await pusd.transfer(recipientAddress, amount);
  await tx.wait();
  console.log("✅ Transfer complete!");
  console.log("   TX Hash:", tx.hash);
  */

  // Example: Mint tokens (only if you're the owner)
  /*
  if (owner.toLowerCase() === signer.address.toLowerCase()) {
    console.log("\n🏭 Minting 1000 PUSD...");
    const mintAmount = ethers.parseUnits("1000", 6);
    const mintTx = await pusd.mint(signer.address, mintAmount);
    await mintTx.wait();
    console.log("✅ Mint complete!");
    console.log("   TX Hash:", mintTx.hash);
  }
  */

  console.log("\n✨ Interaction complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

