const hre = require('hardhat');
require('@nomiclabs/hardhat-web3');
const { BigNumber } = require('ethers');
require('dotenv').config();
const { readDeployment,saveDeployment } = require('./utils');


async function main() {
  const provider = new ethers.providers.WebSocketProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  //拿到ABI
  const { abi: RandomNumberVRFABI } = require('../artifacts/contracts/RandomNumberVRF.sol/RandomNumberVRF.json');
  //获取Oracle地址
  const deployment = readDeployment();
  const addr = deployment.rnvAddress;

  if (!addr) {
    console.log('Please deploy contract RandomNumberVRF first');
    return;
  }

  let rnvVRF, user1;
  //创建 RandomNumberVRF 合约的实例
  rnvVRF = new ethers.Contract(addr, RandomNumberVRFABI, wallet);
  [user1] = await ethers.getSigners();
  
  console.error('signer is: ', user1.address);
  //使用 on() 方法监听合约的 "RequestSent" 和 "RequestFulfilled" 事件。 
    let random0ID;
    console.log(`Listen on random number call...`);
    rnvVRF.on("RequestSent", (ruquestId) => {
      console.log('Event RequestId(address,uint256)');
      console.log("requestID is :" ,ruquestId); 
      random0ID = ruquestId;
    });

    let random0Res = false;
    console.log(`Listen on random number result...`);
    rnvVRF.on("RequestFulfilled", (requestID) => {
      console.log('Event RequestFulfilled(uint256,uint256[])');
      random0Res = true; //  verify whether random generate or not.
      console.log('RandomNumber generated, calling RequestStatus to get randomWords[]');
       
    });
    //使用 requestRandomWords() 方法发起请求获取随机数。
    const tx0 = await rnvVRF.requestRandomWords();

    console.log('first transaction hash:', tx0.hash);

    // wait for the result event
    for (let i = 0; i < 500; i++) {
      if (random0Res) {
        saveDeployment({
          requestID: random0ID.toString(),
        });
        break;
      }
      console.log(`${i}: Please be patient, it will take sometime to get the result`)
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }

    
  const  getStat  = await rnvVRF.getRequestStatus(random0ID);
  console.log('RequestStatus  is: ',getStat);
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });