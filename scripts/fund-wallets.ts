import { ethers } from "hardhat";

/**
 * Helper script to fund test wallets with Sepolia ETH
 *
 * Usage:
 * npx hardhat run scripts/fund-wallets.ts --network sepolia
 */

async function main() {
  console.log("\n💰 Funding Test Wallets with Sepolia ETH...\n");
  console.log("=".repeat(60) + "\n");

  // Get all signers
  const signers = await ethers.getSigners();
  const owner = signers[0];

  if (signers.length < 2) {
    console.log("❌ No additional wallets found in configuration.");
    console.log("   Make sure TEST_WALLET_2 and TEST_WALLET_3 are in .env\n");
    return;
  }

  console.log("📊 Current Balances:\n");

  // Show all balances
  for (let i = 0; i < signers.length; i++) {
    const balance = await ethers.provider.getBalance(signers[i].address);
    console.log(`   Wallet ${i + 1}: ${ethers.formatEther(balance)} ETH`);
    console.log(`             ${signers[i].address}`);
  }

  console.log("\n" + "=".repeat(60) + "\n");

  // Amount to send to each wallet (0.02 ETH)
  const amountToSend = ethers.parseEther("0.02");
  const minRequiredBalance = ethers.parseEther("0.01");

  console.log("💸 Funding wallets that need gas...\n");

  let totalSent = 0;
  const transactions: any[] = [];

  // Fund each wallet that needs it
  for (let i = 1; i < signers.length; i++) {
    const wallet = signers[i];
    const balance = await ethers.provider.getBalance(wallet.address);

    if (balance < minRequiredBalance) {
      console.log(`   Sending 0.02 ETH to Wallet ${i + 1}...`);
      console.log(`   Address: ${wallet.address}`);

      try {
        const tx = await owner.sendTransaction({
          to: wallet.address,
          value: amountToSend,
        });

        console.log(`   Transaction: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`   ✅ Confirmed in block ${receipt?.blockNumber}\n`);

        transactions.push({
          wallet: i + 1,
          address: wallet.address,
          amount: "0.02",
          txHash: tx.hash,
        });

        totalSent++;
      } catch (error: any) {
        console.log(`   ❌ Failed: ${error.message}\n`);
      }
    } else {
      console.log(
        `   ✅ Wallet ${
          i + 1
        } already has sufficient balance (${ethers.formatEther(balance)} ETH)\n`
      );
    }
  }

  console.log("=".repeat(60) + "\n");

  if (totalSent > 0) {
    console.log("✅ Funding Complete!\n");
    console.log(`   Wallets funded: ${totalSent}`);
    console.log(`   Total sent: ${totalSent * 0.02} ETH\n`);

    console.log("📊 New Balances:\n");
    for (let i = 0; i < signers.length; i++) {
      const balance = await ethers.provider.getBalance(signers[i].address);
      console.log(`   Wallet ${i + 1}: ${ethers.formatEther(balance)} ETH`);
    }
    console.log();
  } else {
    console.log("✅ All wallets already have sufficient gas fees!\n");
  }

  console.log("🎉 Done! You can now run integration tests.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
