const { ethers } = require("hardhat")

const main = async () => {
    const initialSupply = ethers.utils.parseEther("100000");

    const [deployer] = await ethers.getSigners();
    console.log('Address deploying the contract --> ', deployer.address)

    const tokenFactry = await ethers.getContractFactory("Token");
    const contract = await tokenFactry.deploy(initialSupply);
    console.log('Address deploying the contract --> ', contract.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
