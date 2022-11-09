// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./ITJoyArcade.sol";
import "./ITJoyGenetics.sol";

contract TJoyMint is Ownable, AccessControl {
    mapping(address => bool) public owners;

    IERC721[] private nftsCollections;
    ITJoyGenetics private gen;

    ITJoyArcade private nfts;

    uint256 totalMinted = 0;
    uint256 maxMint;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(uint256 _maxMint) {
        maxMint = _maxMint;
        _grantRole(MINTER_ROLE, msg.sender);
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

    function mint() public returns (uint256) {
        require(maxMint > totalMinted, "max minted");

        require(!owners[msg.sender], "owner as minted");

        //TODO: comprobar que tenga algun nft de las colecciones
        totalMinted = totalMinted + 1;

        uint256 _gen = gen.extractGenetic();

        owners[msg.sender] = true;

        return nfts.safeMint(msg.sender, _gen);
    }
}
