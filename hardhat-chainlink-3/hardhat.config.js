require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
require('dotenv').config();
require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-etherscan");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();
  
  for (const account of accounts) {
    console.log(account.address);
  }
});
function mnemonic() {
  
  return process.env.PRIVATE_KEY
  
}

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.6"
      },
      {
        version: "0.8.7",
        settings: {}
      }
    ]
  },

  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/' + process.env.ALCHEMY_ID,
      accounts: [mnemonic()],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: process.env.APIKEY
  }
};