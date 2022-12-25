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

    struct Score {
        uint256 tournamentId;
        uint256 score;
    }

    mapping(uint256 => Tournament) tournaments;

    mapping(address => Score[]) players;

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

    function registerPlayer(uint256 _tournamentId, address _address)
        public
        payable
    {
        Score[] memory playerScore = players[_address];

        bool playerIsRegistered = false;

        for (uint256 i = 0; i < playerScore.length; i++) {
            if (playerScore[i].tournamentId == _tournamentId) {
                playerIsRegistered = true;
            }
        }

        require(
            playerIsRegistered == false,
            "This account is already registered in this tournament"
        );

        Score memory newScore = Score({tournamentId: _tournamentId, score: 0});

        players[_address].push(newScore);
    }

    function updatePlayerScore(
        uint256 _tournamentId,
        uint256 _score,
        address _address
    ) public payable {
        for (uint256 i = 0; i < players[_address].length; i++) {
            if (players[_address][i].tournamentId == _tournamentId) {
                players[_address][i].score = _score;
            }
        }
    }

    function getPlayerScores(address _address)
        public
        view
        returns (Score[] memory)
    {
        return players[_address];
    }
}
