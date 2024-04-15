// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";//注意，5.0.0以上的openzeppelin库中没有Counters.sol，请用低版本
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
 
    Counters.Counter private _tokenIds;
 
    constructor() ERC721("SimpleNFT", "Simple") {}
    function mint(address recipient, string memory tokenURI) public returns (uint256){
 
        _tokenIds.increment();
 
        uint256 newItemId = _tokenIds.current();
 
        _safeMint(recipient, newItemId);
 
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}