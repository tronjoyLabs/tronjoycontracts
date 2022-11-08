// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TJoyGenetics is Ownable {
    uint256[] private available;
    uint256[] private used;
    using SafeMath for uint256;

    constructor() {}

    function getAvailable() public view returns (uint256[] memory) {
        return available;
    }

    function addGenetic(uint256 _gen) public onlyOwner {
        available.push(_gen);
    }

    function addGenetics(uint256[] memory _genetics) public onlyOwner {
        available = _genetics;
    }

    function totalUsed() public view returns (uint256) {
        return used.length;
    }

    function totalAvailable() public view returns (uint256) {
        return available.length;
    }

    function extractGenetic() public onlyOwner returns (uint256) {
        uint256 choosenIndex = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
            )
        ) % available.length;

        uint256 genetica = available[choosenIndex];

        available[choosenIndex] = available[available.length - 1];

        available.pop();

        used.push(genetica);

        return genetica;
    }
}
