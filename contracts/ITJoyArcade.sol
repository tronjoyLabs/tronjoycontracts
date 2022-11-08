// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITJoyArcade is IERC721 {
    function safeMint(address to, uint256 gen) external returns (uint256);
    function totalSupply() external view returns (uint256);
    function getGen(uint256 index) external view returns (uint256);
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);

}
