// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TJoyGenetics is Ownable {
    uint256[] private avalaible;
    uint256[] private used;
    using SafeMath for uint256;

    constructor() {}

    function addGenetic(uint256 _gen) public onlyOwner {
        avalaible.push(_gen);
    }

    function totalUsed() public view returns (uint256) {
        return used.length;
    }

    function totalAvailable() public view returns (uint256) {
        return avalaible.length;
    }

    function extractGenetic() public onlyOwner returns (uint256) {
        uint256 _random = uint256(
            keccak256(
                abi.encodePacked(
                    block.difficulty,
                    block.timestamp,
                    avalaible.length
                )
            )
        ).mod(avalaible.length);

        uint256 genetica = avalaible[_random];

        delete avalaible[_random];
        used.push(genetica);
        return genetica;
    }
}
