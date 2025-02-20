const { ethers, artifacts } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Contract has been deployed by address: ", deployer.address);

  const solidityContract = await ethers.deployContract("MyNFTMarketplace");
  const contractAddress = await solidityContract.getAddress();

  console.log("Deployed contract address is: ", contractAddress);

  saveContarctDetails(contractAddress);
}

function saveContarctDetails(contractAddress) {
  const fs = require("fs");
  const path = require("path");

  const contractDir = path.join(__dirname, "..", "frontend", "contracts");

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  fs.writeFileSync(
    path.join(contractDir, "contract-address.json"),
    JSON.stringify({ address: contractAddress }, undefined, 2)
  );

  const contractArtifacts = artifacts.readArtifactSync("MyNFTMarketplace");

  fs.writeFileSync(
    path.join(contractDir, "MyNFTMarketplace.json"),
    JSON.stringify(contractArtifacts, undefined, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
