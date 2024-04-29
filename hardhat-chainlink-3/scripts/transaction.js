const { ethers } = require('hardhat');
const { readDeployment } = require('./utils');

async function main() {
    const deployment = readDeployment();
    const addr = deployment.rnvAddress;
    const requestID = deployment.requestID;
   
    const random = await ethers.getContractAt("RandomNumberVRF",addr);

    console.log("Going to get RequestStatus");
    const requests = await random.getRequestStatus(requestID);
  
    console.log(requests);

    console.log("Going to get randomWords");
    const overview = await requests.randomWords;
    console.log(overview);
    
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });