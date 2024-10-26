// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
    uint256 public nextTokenId;

    constructor() ERC721("Mock NFT", "MNFT") {}

    function mint(address to) public {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}