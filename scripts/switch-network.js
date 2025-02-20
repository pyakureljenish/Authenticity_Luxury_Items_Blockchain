const fs = require("fs");
const path = require("path");

const networks = {
  hardhat: {
    name: "Hardhat",
    chainId: 31337,
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    rpcUrl: "http://127.0.0.1:8545",
  },
  sepolia: {
    name: "Sepolia",
    chainId: 11155111,
    contractAddress: "0x1234567890123456789012345678901234567890", // Update after deployment
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  },
};

const network = process.argv[2];
if (!network || !networks[network]) {
  console.error("Please specify network: hardhat or sepolia");
  process.exit(1);
}

const envPath = path.join(__dirname, "../frontend/.env.local");
const envContent = `NEXT_PUBLIC_NETWORK=${network}
NEXT_PUBLIC_CONTRACT_ADDRESS=${networks[network].contractAddress}
NEXT_PUBLIC_CHAIN_ID=${networks[network].chainId}`;

fs.writeFileSync(envPath, envContent);
console.log(`Switched to ${network} network`);
