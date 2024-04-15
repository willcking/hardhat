const { ethers, network } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log(  "Deploying contracts with the account:", deployer.address);

    const SimplenftFactory = await ethers.getContractFactory("SimpleNFT");

    const SimpleNFT = await SimplenftFactory.deploy();
    await SimpleNFT.deployed();

    console.log('contract be deployed --> ', SimpleNFT.address);
}

main()
  .then(() => {})
  .catch(error => {
    console.error(error);
    process.exit(1);
  });