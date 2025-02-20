import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

// Ensure private key is properly formatted
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY?.startsWith("0x")
  ? process.env.SEPOLIA_PRIVATE_KEY
  : `0x${process.env.SEPOLIA_PRIVATE_KEY}`;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 0,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  paths: {
    artifacts: "./frontend/utils/artifacts",
  },
};

export default config;
