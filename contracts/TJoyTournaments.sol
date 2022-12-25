// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TJoyTournaments is Ownable {
    struct Tournament {
        uint256 id;
        string name;
        bool active;
        uint256 duration;
    }

    mapping(uint256 => Tournament) tournaments;

    uint256 nextTournamentId = 0;

    function createTournament(string memory _name, uint256 _duration)
        public
        payable
        onlyOwner
    {
        Tournament memory newTournament = Tournament({
            id: nextTournamentId,
            name: _name,
            active: false,
            duration: _duration
        });

        tournaments[nextTournamentId] = newTournament;

        nextTournamentId += 1;
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
