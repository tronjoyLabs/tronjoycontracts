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
        bool reclaimable;
    }

    mapping(uint256 => mapping(address => Award)) public awards;

    mapping(uint256 => Tournament) public tournaments;

    constructor() {
        contractAddress = address(this);

        contractOwner = msg.sender;
    }

    event Register(uint256 tournamentId, address playerAddress);

    function getContractBalance() public view returns (uint256) {
        return contractAddress.balance;
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
    ) public payable onlyOwner {
        Award memory newAward = Award({
            amount: _amount,
            nftId: _nftId,
            nft: _nft,
            received: false,
            reclaimable: true
        });

        if (_nftId != 0) {
            _nft.transferFrom(msg.sender, contractAddress, _nftId);
        }

        awards[_tournamentId][_player] = newAward;
    }

    function updateAward(
        uint256 _tournamentId,
        address _player,
        uint256 _amount,
        uint256 _nftId,
        IERC721 _nft,
        bool _reclaimable
    ) public payable {
        require(
            awards[_tournamentId][_player].received == false,
            "This award has been already claimed"
        );

        Award memory updatedAward = Award({
            amount: _amount,
            nftId: _nftId,
            nft: _nft,
            received: false,
            reclaimable: _reclaimable
        });

        awards[_tournamentId][_player] = updatedAward;
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

        require(
            awards[_tournamentId][msg.sender].reclaimable == true,
            "This award is not reclaimable"
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
                contractAddress,
                msg.sender,
                awards[_tournamentId][msg.sender].nftId
            );
        }
    }
}
