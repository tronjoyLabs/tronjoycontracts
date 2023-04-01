// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./ITJoyArcade.sol";
import "./ITJoyGenetics.sol";
import "./MinterRole.sol";

contract TJoyMint is Ownable, MinterRole {
    mapping(address => uint256) public owners;

    IERC721[] private nftsCollections;

    ITJoyGenetics private gen;

    ITJoyArcade private nfts;

    uint256 totalMinted = 0;

    uint256 maxMint;

    constructor(uint256 _maxMint) {
        maxMint = _maxMint;
    }

    event AddressWhitelisted(address _address);

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

    function addWhitelists(address[] memory wallets) public {
        for (uint256 i = 0; i < wallets.length; i++) {
            owners[wallets[i]] = 1;

            emit AddressWhitelisted(wallets[i]);
        }
    }

    function mint() public {
        require(maxMint > totalMinted, "max minted");

        require(owners[msg.sender] == 1, "sender is not whitelisted");

        totalMinted = totalMinted + 1;

        uint256 _gen = gen.extractGenetic();

        owners[msg.sender] = 2;

        nfts.safeMint(msg.sender, _gen);
    }
}
