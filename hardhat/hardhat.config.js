/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("hardhat-gas-reporter");

require('dotenv').config();

task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const privateKey = process.env.PRIVATE_KEY;
const Sapolia_Url = process.env.SAPOLIA_URL;

module.exports = {
  solidity: {
    version: "0.8.8"
  },
  
  gasReporter: {
    enabled: true,
},

  networks: {
    hardhat: {
      // 可以设置一个固定的gasPrice，在测试gas消耗的时候会很有用
      gasPrice: 1000000000,
    },

    Sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/1BMRU1Qp_ea0ljr33TrCC2l0ieU9nMiI",
      accounts: [privateKey]
    },
      forking: {
      url: Sapolia_Url,
      blockNumber: 4043801
    }

  },
}
