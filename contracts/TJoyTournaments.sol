// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TJoyTournaments is Ownable {
    struct Tournament {
        uint256 index;
        string name;
        bool active;
    }

    mapping(uint256 => Tournament) tournaments;

    uint256 tournamentIndex = 0;

    function createTournament(string memory _name) public payable onlyOwner {
        Tournament memory newTournament = Tournament({
            index: tournamentIndex,
            name: _name,
            active: false
        });

        tournaments[tournamentIndex] = newTournament;

        tournamentIndex += 1;
    }

    function getTournament(uint256 _index)
        public
        view
        returns (Tournament memory)
    {
        return tournaments[_index];
    }

    function initTournament(uint256 _index) public payable onlyOwner {
        tournaments[_index].active = true;
    }

    function endTournament(uint256 _index) public payable onlyOwner {
        tournaments[_index].active = false;
    }
}
