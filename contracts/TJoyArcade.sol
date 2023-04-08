// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

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
  mapping(uint256 => uint256) public tokenIdToGen;

  string public baseURI;

  constructor() ERC721("TronJoyArcade", "TJARC") {
    _tokenIdCounter._value = 1;
  }

  event NftMinted(address owner, uint256 nftId, uint256 genetic);

  function getNftBalance(address _address) public view returns (uint256) {
    return balanceOf(_address);
  }

  function tokenURI(
    uint256 tokenId
  ) public view virtual override returns (string memory) {
    _requireMinted(tokenId);

    return
      bytes(baseURI).length > 0
        ? string(abi.encodePacked(baseURI, Strings.toString(getGen(tokenId))))
        : "";
  }

  function setBaseURI(string memory _baseURI) public onlyOwner {
    baseURI = _baseURI;
  }

  function getGen(uint256 _tokenId) public view returns (uint256) {
    return genetics[_tokenId];
  }

  function getTokenIdFromGen(uint256 _gen) public view returns (uint256) {
    return tokenIdToGen[_gen];
  }

  function safeMint(
    address to,
    uint256 gen
  ) public onlyMinter returns (uint256) {
    uint256 tokenId = _tokenIdCounter.current();
    genetics[tokenId] = gen;
    tokenIdToGen[gen] = tokenId;
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    emit NftMinted(to, tokenId, gen);
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

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
