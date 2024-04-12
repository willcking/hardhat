const { ethers } = require("hardhat");
const { expect } = require('chai');


describe("Test SimpleToken.sol", function () {
    let SimpleToken;
    let SimpleTokenAddress;
    let owner;
    let alice;
    let bob;
    let elk;

    beforeEach(async function () {
        SimpleToken = await ethers.getContractFactory('SimpleToken');
        [owner, alice, bob, elk] = await ethers.getSigners();
        SimpleTokenAddress = await SimpleToken.deploy(
            'SimpleToken Test',
            'SimpleToken Test',
            1,
            1000000
          )
        await SimpleTokenAddress.deployed()
    })

    describe('Deployment', function () {
        it('Should assign the total supply of tokens to the owner', async function () {
          const ownerBalance = await SimpleTokenAddress.balanceOf(owner.address)
          expect(await SimpleTokenAddress.totalSupply()).to.equal(ownerBalance)
        })
    })

    describe('Transaction', function () {
      it('Should transfer tokens between accounts', async function () {
        // owner transfer tokens to alice
        await SimpleTokenAddress.transfer(alice.address, 50)
        const aliceBalance = await SimpleTokenAddress.balanceOf(alice.address)
        expect(aliceBalance).to.equal(50)
        //  alice transfer tokens to bob
        await SimpleTokenAddress.connect(alice).transfer(bob.address, 50)
        const bobBalance = await SimpleTokenAddress.balanceOf(bob.address)
        expect(bobBalance).to.equal(50)
      })
    })

    it('Should fail if sender doesn’t have enough tokens', async function () {
      const initialOwnerBalance = await SimpleTokenAddress.balanceOf(
        owner.address
      )
      // alice fail to transfer tokens to owner 
      await expect(
        SimpleTokenAddress.connect(alice).transfer(owner.address, 10000)
      ).to.be.revertedWith('ERC20InsufficientBalance("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 0, 10000)');

      expect(await SimpleTokenAddress.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      )
    })
})

