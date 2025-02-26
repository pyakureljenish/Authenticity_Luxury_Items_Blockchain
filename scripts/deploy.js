const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying MyNFTMarketplace contract with the account:",
    deployer.address
  );

  // Deploy MyNFTMarketplace with no constructor arguments
  const nftMarketplaceContract = await ethers.deployContract(
    "MyNFTMarketplace",
    []
  );
  const contractAddress = await nftMarketplaceContract.getAddress();

  console.log("Contract address:", contractAddress);
  saveFrontendFiles(contractAddress);
}

function saveFrontendFiles(contractAddress) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ MyNFTMarketplace: contractAddress }, undefined, 2)
  );

  const MyNFTMarketplaceArtifact =
    artifacts.readArtifactSync("MyNFTMarketplace");

  fs.writeFileSync(
    path.join(contractsDir, "MyNFTMarketplace.json"),
    JSON.stringify(MyNFTMarketplaceArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
