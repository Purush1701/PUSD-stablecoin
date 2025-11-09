import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying PUSD v3 Stablecoin...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy PUSDv3
  const PUSDv3 = await ethers.getContractFactory("PUSDv3");
  const pusdv3 = await PUSDv3.deploy();
  await pusdv3.waitForDeployment();

  const pusdAddress = await pusdv3.getAddress();
  console.log("✅ PUSDv3 deployed to:", pusdAddress);

  // Get deployment details
  const totalSupply = await pusdv3.totalSupply();
  const maxSupply = await pusdv3.MAX_SUPPLY();
  const decimals = await pusdv3.decimals();
  const symbol = await pusdv3.symbol();
  const name = await pusdv3.name();
  const paused = await pusdv3.paused();

  console.log("\n📊 Token Details:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals.toString());
  console.log("   Initial Supply:", ethers.formatUnits(totalSupply, decimals), symbol);
  console.log("   Max Supply:", ethers.formatUnits(maxSupply, decimals), symbol);
  console.log("   Owner:", deployer.address);
  console.log("   Paused:", paused);

  console.log("\n✨ NEW v3 Features:");
  console.log("   ✅ Pause/Unpause functionality");
  console.log("   ✅ Blacklist/Unblacklist addresses");
  console.log("   ✅ Max supply cap (100M PUSD)");
  console.log("   ✅ Enhanced security controls");
  console.log("   ✅ All v2 features (redeem/burn)");

  // Verify on Etherscan (if not localhost)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    const receipt = await pusdv3.deploymentTransaction()?.wait(6);
    
    console.log("\n📝 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: pusdAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error: any) {
      console.log("❌ Error verifying contract:", error.message);
    }
  }

  console.log("\n🎉 Deployment complete!");
  console.log(`\nView on Etherscan: https://${hre.network.name !== "mainnet" ? hre.network.name + "." : ""}etherscan.io/address/${pusdAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

