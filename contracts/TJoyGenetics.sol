// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./MinterRole.sol";

contract TJoyGenetics is Ownable, MinterRole {
    uint256[] private available;
    uint256[] private used;
    using SafeMath for uint256;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() {}

    function getAvailable() public view returns (uint256[] memory) {
        return available;
    }

    function addGenetic(uint256 _gen) public onlyMinter {
        available.push(_gen);
    }

    function addGenetics(uint256[] memory _genetics) public onlyMinter {
        for (uint256 i = 0; i < _genetics.length; i++) {
            available.push(_genetics[i]);
        }
    }

    function getUsed() public view returns (uint256[] memory) {
        return used;
    }

    function totalUsed() public view returns (uint256) {
        return used.length;
    }

    function totalAvailable() public view returns (uint256) {
        return available.length;
    }

    function extractGenetic() public onlyMinter returns (uint256) {
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
