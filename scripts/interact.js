const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get signers
  const [owner, player1, player2] = await hre.ethers.getSigners();

  // Read contract address
  const contractAddressPath = path.join(__dirname, "../artifacts/contract-address.txt");
  const contractAddress = fs.readFileSync(contractAddressPath, "utf8").trim();

  // Get contract instance
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const contract = await SimpleStorage.attach(contractAddress);

  // Store a game result
  console.log("Storing a game result...");
  const storeTx = await contract.storeGameResult(
    player1.address,
    player2.address,
    "Rock",
    "Scissors",
    player1.address
  );
  
  // Wait for transaction to be mined
  const receipt = await storeTx.wait();
  
  // Get the game ID from events
  const gameId = Number(receipt.logs[0].args[0]);
  console.log(`Game result stored with ID: ${gameId}`);

  // Retrieve and verify the stored game result
  console.log("\nRetrieving game result...");
  const result = await contract.getGameResult(gameId);
  
  console.log("Stored Game Details:");
  console.log(`Player 1: ${result.player1}`);
  console.log(`Player 2: ${result.player2}`);
  console.log(`Move 1: ${result.move1}`);
  console.log(`Move 2: ${result.move2}`);
  console.log(`Winner: ${result.winner}`);
  console.log(`Timestamp: ${new Date(Number(result.timestamp) * 1000)}`);

  // Get total number of game results
  const gameCount = await contract.getGameResultsCount();
  console.log(`\nTotal game results stored: ${gameCount}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });