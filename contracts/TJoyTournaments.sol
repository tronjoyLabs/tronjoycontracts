// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Importamos la interfaz de TJoyArcade
// import "./ITJoyArcade.sol";

// Importamos el contrato Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

// Importamos la interfaz que nos permitirá usar métodos pertenecientes al contrato ERC721
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// Declaramos nuestro contrato que, además de tener sus propios métodos también hereda de Ownable
contract TJoyTournaments is Ownable {
    // Guardamos en una variable la dirección del contrato
    address public contractAddress;

    // address public contractOwner;

    // Declaramos la variable "nfts" en la que se almacenará la instancia de la interfaz de TJoyArcade
    // ITJoyArcade private nfts;

    // Declaramos un struct para los torneos
    struct Tournament {
        uint256 id;
        bool paused;
        uint256 price;
        uint256 fee;
        uint256 initPool;
        uint256 payPool;
        uint256 beginingDate;
        uint256 finishDate;
        IERC721 nft;
        bool isReclaimable;
    }

    uint256 businessBalance;

    // Declaramos un struct Score
    // Este struct tiene el id del torneo al que pertence y la puntuación propiamente dicha
    // struct Score {
    //     uint256 tournamentId;
    //     uint256 score;
    // }

    // Declaramos un struct que guarda mejores puntuaciones
    /* struct BestScore {
        address addr;
        uint256 score;
    } */

    // struct Award {
    //     uint256 amount;
    //     IERC721 nft;
    //     uint256 nftId;
    //     bool claimed;
    // }

    // Declaramos un struct que tiene cada premio de un torneo
    // struct TrxAward {
    //     address player;
    //     uint256 amount;
    // }

    // struct NftAward {
    //     address player;
    //     uint256 id;
    //     IERC721 nft;
    // }

    struct NftAward {
        uint256 id;
        IERC721 nft;
    }

    // En esta mapeo están los premios de cada torneo
    // mapping(uint256 => TrxAward[]) trxAwardsDistribution;
    mapping(uint256 => mapping(address => uint256)) trxAwardsDistribution;

    mapping(uint256 => mapping(address => NftAward)) nftAwardsDistribution;

    // Este mapeo continene arrays con los premios asociados al id del torneo
    // mapping(uint256 => Award[]) tournamentsAwards;

    // Declaramos un mapeo para torneos con el id de cada torneo como clave y el torneo del tipo del struct Tournaments como valor
    mapping(uint256 => Tournament) tournaments;

    // El siguiente será un mapeo de jugadores y contendrá la address como clave y como valor un array de puntuaciones
    // Cada puntuación es un struct Score que contiene el id del torneo y la puntuación
    // Se pretende que el jugador pueda tener diferentes scores, uno para cada torneo en el que participe
    // mapping(address => Score[]) players;

    // Este mapeo contiene las mejores puntuaciones de cada torneo
    // mapping(uint256 => BestScore[]) tournamentsBests;

    // Esta variable la vamos a emplear para asignar ids secuenciales a los torneos
    uint256 public nextTournamentId = 0;

    // Declaramos nuestro constructor
    constructor() {
        // Guardamos la dirección del contrato en una variable para utilizarla posteriormente
        contractAddress = address(this);
        // contractOwner = msg.sender;
    }

    // Lanzamos este evento cada vez que un jugador se registra en un torneo de pago
    event Register(uint256 tournamentId, address playerAddress);

    // Devolvemos, por medio de esta función, el balance del contrato
    function getContractBalance() public view returns (uint256) {
        return contractAddress.balance;
    }

    // Devolvemos los fondos destinados a la utilización de la empresa
    function getBusinessBalance() public view returns (uint256) {
        return businessBalance;
    }

    // La siguiente función nos devuelve un torneo con toda su información
    function getTournament(uint256 _id)
        public
        view
        returns (Tournament memory)
    {
        return tournaments[_id];
    }

    function getTrxTournamentAward(uint256 _id, address _player)
        public
        view
        returns (uint256)
    {
        return trxAwardsDistribution[_id][_player];
    }

    function getNftTournamentAward(uint256 _id, address _player)
        public
        view
        returns (NftAward memory)
    {
        return nftAwardsDistribution[_id][_player];
    }

    // retiro de fees
    // function withdraw(uint256 _amount) public payable onlyOwner {
    //     businessBalance = businessBalance - _amount;
    //     this.send(_amount, contractOwner);
    // }

    // Con esta función injectamos trx al contrato
    // function injectFunds(uint256 _amount) public payable onlyOwner {
    //     require(_amount == msg.value);
    // }

    // La siguiente función es la que nos va a servir para instanciar en interfaz de TJoyArcade
    // function setNfts(ITJoyArcade _nfts) public onlyOwner {
    //     nfts = _nfts;
    // }

    // Esta es la función que nos permite crear un nuevo torneo
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
            beginingDate: _beginingDate,
            finishDate: _finishDate,
            nft: _nft,
            isReclaimable: false
        });

        tournaments[nextTournamentId] = newTournament;

        businessBalance += msg.value;

        nextTournamentId += 1;
    }

    // function getTournamentAwards(uint256 _id)
    //     public
    //     view
    //     returns (Award[] memory)
    // {
    //     return tournamentsAwards[_id];
    // }

    // function getTimestamp() public view returns (uint256) {
    //     return block.timestamp;
    // }

    // Esta función permite a un usuario registrarse en un torneo
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

    function addTrxAward(
        uint256 _tournamentId,
        address _player,
        uint256 _amount
    ) public payable {
        trxAwardsDistribution[_tournamentId][_player] = _amount;
    }

    function addNftAward(
        uint256 _tournamentId,
        address _player,
        uint256 _tokenId,
        IERC721 _nft
    ) public payable {
        NftAward memory newNftAward = NftAward({id: _tokenId, nft: _nft});

        nftAwardsDistribution[_tournamentId][_player] = newNftAward;
    }

    // La siguiente función devuelve las puntuaciones de todos los torneos en los que ha participado un jugador
    // function getPlayerScores(address _address)
    //     public
    //     view
    //     returns (Score[] memory)
    // {
    //     return players[_address];
    // }

    // Esta función devuelve la puntuación de un jugador en un torneo concreto
    // function getPlayerScore(uint256 _tournamentId, address _address)
    //     public
    //     view
    //     returns (uint256)
    // {
    //     //Comprobar que el torneo existe
    //     require(
    //         tournaments[_tournamentId].id == _tournamentId,
    //         "Tournament does not exist"
    //     );

    //     // Comprobamos que el usuario esté registrado en el torneo
    //     require(
    //         players[_address].length > 0,
    //         "This account is not registered in this tournament"
    //     );

    //     Score[] memory playerScores = players[_address];

    //     bool scoreFound = false;
    //     uint256 index = 0;
    //     uint256 score = 0;

    //     while (!scoreFound && index < playerScores.length) {
    //         if (playerScores[index].tournamentId == _tournamentId) {
    //             score = playerScores[index].score;
    //             scoreFound = true;
    //         }
    //         index++;
    //     }

    //     return score;
    // }

    // Obtener los mejores jugadores de un torneo
    // function getTopPlayers(uint256 _tournamentId)
    //     public
    //     view
    //     returns (BestScore[] memory)
    // {
    //     require(
    //         tournaments[_tournamentId].id == _tournamentId,
    //         "Tournament does not exist"
    //     );
    //     return tournamentsBests[_tournamentId];
    // }

    // function registerRewards(uint256 _tournamentId, _tournamentsBests)
    //     onlyOwner
    // {
    //     // registramos los premios
    //     tournamentsBests[_tournamentId] = _tournamentsBests;
    //     tournaments[_tournamentId].isClaimable = true;
    // }

    // Función para reclamar recompensas
    // function claimRewards(uint256 _tournamentId) public payable {
    //     // require(tournaments[_tournamentId].isClaimable);
    //     require(
    //         block.timestamp >= tournaments[_tournamentId].finishDate,
    //         "This tournament has not finished yet"
    //     );

    //     bool rewardClaimed = false;

    //     uint256 index = 0;

    //     while (
    //         rewardClaimed == false &&
    //         index < tournamentsAwards[_tournamentId].length
    //     ) {
    //         if (tournamentsBests[_tournamentId][index].addr == msg.sender) {
    //             require(
    //                 tournamentsAwards[_tournamentId][index].claimed == false
    //             );
    //             if (tournamentsAwards[_tournamentId][index].amount) {
    //                 payable(msg.sender).transfer(
    //                     tournamentsAwards[_tournamentId][index].amount
    //                 );
    //             }
    //             if (tournamentsAwards[_tournamentId][index].nft) {
    //                 payable(msg.sender).transfer(
    //                     tournamentsAwards[_tournamentId][index].nft
    //                 );
    //             }

    //             tournamentsAwards[_tournamentId][index].claimed = true;

    //             rewardClaimed = true;
    //         } else {
    //             index++;
    //         }
    //     }
    // }
}
