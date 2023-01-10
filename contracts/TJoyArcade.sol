// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MinterRole.sol";

contract TJoyArcade is
    ERC721,
    ERC721Enumerable,
    ERC721Burnable,
    Ownable,
    MinterRole
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => uint256) public genetics;

    constructor() ERC721("TronJoyArcade", "TJARC") {}

    function getNftBalance(address _address) public view returns (uint256) {
        return balanceOf(_address);
    }

    function getGen(uint256 _tokenId) public view returns (uint256) {
        return genetics[_tokenId];
    }

    function safeMint(address to, uint256 gen)
        public
        onlyMinter
        returns (uint256)
    {
        uint256 tokenId = _tokenIdCounter.current();
        genetics[tokenId] = gen;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
