import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying PUSD v2 Stablecoin...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy PUSDv2
  const PUSDv2 = await ethers.getContractFactory("PUSDv2");
  const pusdv2 = await PUSDv2.deploy();
  await pusdv2.waitForDeployment();

  const pusdAddress = await pusdv2.getAddress();
  console.log("✅ PUSDv2 deployed to:", pusdAddress);

  // Get deployment details
  const totalSupply = await pusdv2.totalSupply();
  const decimals = await pusdv2.decimals();
  const symbol = await pusdv2.symbol();
  const name = await pusdv2.name();

  console.log("\n📊 Token Details:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals.toString());
  console.log("   Total Supply:", ethers.formatUnits(totalSupply, decimals), symbol);
  console.log("   Owner:", deployer.address);

  console.log("\n✨ NEW v2 Features:");
  console.log("   ✅ Redeem function (burn tokens)");
  console.log("   ✅ Multi-currency support (USD, EUR, etc.)");
  console.log("   ✅ Event emission for off-chain tracking");

  // Verify on Etherscan (if not localhost)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    const receipt = await pusdv2.deploymentTransaction()?.wait(6);
    
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

