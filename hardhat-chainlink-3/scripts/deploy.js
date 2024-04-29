const { ethers } = require('hardhat');
require('dotenv').config();
const { saveDeployment } = require('./utils');

async function main() {
    //部署
    const RnvContractFactory = await ethers.getContractFactory("RandomNumberVRF");
    const rnv = await RnvContractFactory.deploy(process.env.SubscriptionId);
    console.log("deploying....");
    await rnv.deployed()
    console.log("rnv deployed to:", rnv.address);

    //写入
    saveDeployment({
      rnvAddress: rnv.address,
    });
   
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });