// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ITJoyGenetics {
    function extractGenetic() external  returns (uint256);
    function totalAvalaible() external view returns (uint256);
    function totalUsed() external view returns (uint256);
}
