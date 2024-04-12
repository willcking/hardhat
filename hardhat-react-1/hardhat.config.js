require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const Sapolia_Url = process.env.SAPOLIA_URL;

module.exports = {
  solidity: {
    version: "0.8.20"
  },
  
  gasReporter: {
    enabled: true,
},

  networks: {
    Sepolia: {
      url: Sapolia_Url,
      accounts: [privateKey]
    },
  },
}
