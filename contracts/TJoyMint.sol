// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./ITJoyArcade.sol";
import "./ITJoyGenetics.sol";
import "./MinterRole.sol";

contract TJoyMint is Ownable, MinterRole {
    mapping(address => bool) public owners;

    IERC721[] private nftsCollections;
    ITJoyGenetics private gen;

    ITJoyArcade private nfts;

    uint256 totalMinted = 0;
    uint256 maxMint;

    constructor(uint256 _maxMint) {
        maxMint = _maxMint;
    }

    function addNftsCollections(IERC721 _nfts) public onlyOwner {
        nftsCollections[nftsCollections.length] = _nfts;
    }

    function changeNfts(ITJoyArcade _nfts) public onlyOwner {
        nfts = _nfts;
    }

    function changeGen(ITJoyGenetics _gen) public onlyOwner {
        gen = _gen;
    }

    function getTotalOwners() public view returns (uint256) {
        return totalMinted;
    }

    function mint() public {
        require(maxMint > totalMinted, "max minted");

        require(!owners[msg.sender], "owner as minted");

        //TODO: check balance partners and whitelist
        totalMinted = totalMinted + 1;

        uint256 _gen = gen.extractGenetic();

        owners[msg.sender] = true;

        nfts.safeMint(msg.sender, _gen);
    }
}
