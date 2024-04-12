const { network } = require("hardhat");
const { ethers } = require("hardhat");
const path = require("path");

const main = async () => {
    if(network.name === 'hardhat'){
        console.log('You are trying to deploy a contract to the Hardhat Network')
    }

    const [deployer] = await ethers.getSigners();
    console.log('Address deploying the contract --> ', await deployer.getAddress())
    console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString())

    const TokenFactry = await ethers.getContractFactory('SimpleToken')
    const token = await TokenFactry.deploy('Hello', 'Token', 1, 10000)
    await token.deployed()

    console.log('contract be deployed --> ', token.address)

    saveFrontendFiles(token, deployer);
}

function saveFrontendFiles(token, deployerAccount) {
  const fs = require('fs')
  const contractsDir = __dirname + '/../my-app/src/contracts'

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  fs.writeFileSync(
    contractsDir + '/contract-address.json',
    JSON.stringify({ contractAddress: token.address }, undefined, 2)
  )

  const TokenArtifact = artifacts.readArtifactSync('SimpleToken')

  fs.writeFileSync(
    contractsDir + '/SimpleToken.json',
    JSON.stringify(TokenArtifact, null, 2)
  )

  fs.writeFileSync(
    contractsDir + '/deployer.json',
    JSON.stringify({ deployer: deployerAccount }, undefined, 2)
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })