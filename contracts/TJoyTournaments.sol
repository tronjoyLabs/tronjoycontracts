// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TJoyTournaments is Ownable {
    struct Tournament {
        uint256 id;
        bool paused;
        uint256 price;
        uint256 fee;
        uint256 initPool;
        uint256 payPool;
        uint256 distributed;
        uint256 beginingDate;
        uint256 finishDate;
        IERC721 nft;
        bool isReclaimable;
    }

    address public contractOwner;

    address public contractAddress;

    uint256 public businessBalance;

    uint256 public nextTournamentId = 1000000000;

    struct Award {
        uint256 amount;
        uint256 nftId;
        IERC721 nft;
        bool received;
    }

    mapping(uint256 => mapping(address => Award)) awards;

    mapping(uint256 => Tournament) tournaments;

    constructor() {
        contractAddress = address(this);

        contractOwner = msg.sender;
    }

    event Register(uint256 tournamentId, address playerAddress);

    function getContractBalance() public view returns (uint256) {
        return contractAddress.balance;
    }

    function getBusinessBalance() public view returns (uint256) {
        return businessBalance;
    }

    function getTournament(uint256 _id)
        public
        view
        returns (Tournament memory)
    {
        return tournaments[_id];
    }

    function getTournamentAward(uint256 _id, address _player)
        public
        view
        returns (Award memory)
    {
        return awards[_id][_player];
    }

    function createTournament(
        uint256 _price,
        uint256 _fee,
        uint256 _initPoolAmount,
        uint256 _beginingDate,
        uint256 _finishDate,
        IERC721 _nft
    ) public payable onlyOwner {
        require(
            _initPoolAmount == msg.value,
            "_initPoolAmount does not match with msg.value"
        );

        Tournament memory newTournament = Tournament({
            id: nextTournamentId,
            paused: false,
            price: _price,
            fee: _fee,
            initPool: _initPoolAmount,
            payPool: 0,
            distributed: 0,
            beginingDate: _beginingDate,
            finishDate: _finishDate,
            nft: _nft,
            isReclaimable: false
        });

        tournaments[nextTournamentId] = newTournament;

        businessBalance += msg.value;

        nextTournamentId += 1;
    }

    function registerPlayer(uint256 _tournamentId) public payable {
        require(
            block.timestamp >= tournaments[_tournamentId].beginingDate,
            "This tournament has not started yet"
        );
        require(
            block.timestamp <= tournaments[_tournamentId].finishDate,
            "This tournament has already finished"
        );
        require(msg.value == tournaments[_tournamentId].price);
        require(tournaments[_tournamentId].nft.balanceOf(msg.sender) > 0);

        uint256 fee = (msg.value * tournaments[_tournamentId].fee) / 100;

        businessBalance += fee;

        tournaments[_tournamentId].payPool += msg.value - fee;

        emit Register(_tournamentId, msg.sender);
    }

    function addAward(
        uint256 _tournamentId,
        address _player,
        uint256 _amount,
        uint256 _nftId,
        IERC721 _nft
    ) public payable {
        Award memory newAward = Award({
            amount: _amount,
            nftId: _nftId,
            nft: _nft,
            received: false
        });

        awards[_tournamentId][_player] = newAward;
    }

    function reclaimAward(uint256 _tournamentId) public payable {
        require(
            block.timestamp >= tournaments[_tournamentId].finishDate,
            "This tournament has already finished"
        );

        require(
            awards[_tournamentId][msg.sender].received == false,
            "This award has been already taken"
        );

        if (awards[_tournamentId][msg.sender].amount != 0) {
            tournaments[_tournamentId].distributed += awards[_tournamentId][
                msg.sender
            ].amount;

            awards[_tournamentId][msg.sender].received = true;

            payable(msg.sender).transfer(
                awards[_tournamentId][msg.sender].amount
            );
        }

        if (awards[_tournamentId][msg.sender].nftId != 0) {
            awards[_tournamentId][msg.sender].received = true;

            awards[_tournamentId][msg.sender].nft.transferFrom(
                contractOwner,
                msg.sender,
                awards[_tournamentId][msg.sender].nftId
            );
        }
    }
}
