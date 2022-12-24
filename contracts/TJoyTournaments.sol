// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TJoyTournaments is Ownable {
    struct Tournament {
        uint256 index;
        string name;
    }

    mapping(uint256 => Tournament) tournaments;

    Tournament[] tournamentsList;

    uint256 tournamentIndex = 0;

    function createTournament(string memory _name) public payable onlyOwner {
        Tournament memory newTournament = Tournament({
            index: tournamentIndex,
            name: _name
        });

        tournaments[tournamentIndex] = newTournament;

        tournamentsList.push(newTournament);

        tournamentIndex += 1;
    }

    function getTournaments() public view returns (Tournament[] memory) {
        return tournamentsList;
    }

    function getTournament(uint256 _index)
        public
        view
        returns (Tournament memory)
    {
        return tournaments[_index];
    }
}
