const { JsonRpcProvider, Wallet, Contract, ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const config = require("../config/hardhat.js");

const abiPath = path.join(__dirname, "../contract/SimpleStorage.json");
const rawJson = fs.readFileSync(abiPath, "utf8");
const contractJson = JSON.parse(rawJson);

// Extract ABI from artifact
const abi = contractJson.abi;

// Create provider connected to the blockchain RPC
const provider = new JsonRpcProvider(config.RPC_URL);

// Create wallet instance with private key and provider
const wallet = new Wallet(config.PRIVATE_KEY, provider);
console.log("Wallet address:", wallet.address);

// Create contract instance with contract address, ABI, and wallet signer
const contract = new ethers.Contract(config.CONTRACT_ADDRESS, abi, wallet);
console.log("✅ CONTRACT_ADDRESS:", config.CONTRACT_ADDRESS);

// Export contract instance for use in other modules
module.exports = contract;