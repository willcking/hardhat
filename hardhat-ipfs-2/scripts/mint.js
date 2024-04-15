const { ethers, network } = require("hardhat");

 
// Our contract’s ABI (Application Binary Interface) is the interface enabling our js script to interact with our smart contract. Hardhat generates and stores the ABI version of our contract in the artifacts folder as a JSON file.
const contract = require("../artifacts/contracts/SimpleNFT.sol/SimpleNFT.json");
const contractInterface = contract.abi;
 
let provider = ethers.provider;
 
const tokenURI =
  "https://ipfs.io/ipfs/QmeXAKziPKghtuiyXDHb394VRdxuNRWNBcN7K3D6U7ynsx";
const privateKey = `0x${process.env.PRIVATE_KEY}`;
const wallet = new ethers.Wallet(privateKey);
 
wallet.provider = provider;
const signer = wallet.connect(provider);
 
const nft = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractInterface,
  signer
);
 
const main = () => {
  console.log("Waiting 5 blocks for confirmation...");
  nft
    .mint(process.env.PUBLIC_KEY, tokenURI)
    .then((tx) => tx.wait(5))
    .then((receipt) =>
      console.log(
        `Your transaction is confirmed, its receipt is: ${receipt.transactionHash}`
      )
    )
    .catch((e) => console.log("something went wrong", e));
};
 
main()