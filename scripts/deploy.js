const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await Marketplace.deploy();

  // ethers v6
  await marketplace.waitForDeployment();

  const address = await marketplace.getAddress();
  console.log("NFTMarketplace deployed to:", address);

  const frontendDir = path.join(__dirname, "..", "frontend", "src");

  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const data = {
    address: address,
    abi: marketplace.interface.format("json"), // ⚠️ STRING, parse करू नकोस
  };

  fs.writeFileSync(
    path.join(frontendDir, "Marketplace.json"),
    JSON.stringify(data, null, 2)
  );

  console.log("Marketplace.json written to frontend/src");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
