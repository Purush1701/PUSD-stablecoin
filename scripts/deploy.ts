import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying PUSD Stablecoin...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy PUSD
  const PUSD = await ethers.getContractFactory("PUSD");
  const pusd = await PUSD.deploy();
  await pusd.waitForDeployment();

  const pusdAddress = await pusd.getAddress();
  console.log("✅ PUSD deployed to:", pusdAddress);

  // Get deployment details
  const totalSupply = await pusd.totalSupply();
  const decimals = await pusd.decimals();
  const symbol = await pusd.symbol();
  const name = await pusd.name();

  console.log("\n📊 Token Details:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals.toString());
  console.log("   Total Supply:", ethers.formatUnits(totalSupply, decimals), symbol);
  console.log("   Owner:", deployer.address);

  // Verify on Etherscan (if not localhost)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    const receipt = await pusd.deploymentTransaction()?.wait(6);
    
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
  console.log(`\nAdd to Remix: Load at ${pusdAddress}`);
  console.log(`View on Etherscan: https://${hre.network.name !== "mainnet" ? hre.network.name + "." : ""}etherscan.io/address/${pusdAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

