require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL = process.env.SEPOLIA_URL || ""; // Avoid undefined errors
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || ""; // Avoid undefined errors

module.exports = {
  solidity: "0.8.28",
  networks: {
    // Hardhat local blockchain (default for testing)
    hardhat: {
      chainId: 31337, // Hardhat's default network
    },

    // Localhost with custom port
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    // Sepolia testnet (for later deployment)
    sepolia: {
      url: SEPOLIA_URL,
      accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY] : [],
    },
  },
};
