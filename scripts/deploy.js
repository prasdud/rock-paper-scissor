const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Ensure the artifacts directory exists
  const artifactsDir = path.join(__dirname, "../artifacts");
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir);
  }

  // Get the contract factory
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  
  // Deploy the contract
  const simpleStorage = await SimpleStorage.deploy();
  
  // Wait for the contract deployment transaction to be mined
  await simpleStorage.deploymentTransaction().wait(1);
  
  console.log("SimpleStorage deployed to:", await simpleStorage.getAddress());
  
  // Write contract address to file
  const contractAddressPath = path.join(__dirname, "../artifacts/contract-address.txt");
  fs.writeFileSync(contractAddressPath, await simpleStorage.getAddress());
  console.log(`Contract address saved to ${contractAddressPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });