// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Importamos la interfaz de TJoyArcade
import "./ITJoyArcade.sol";
// Importamos el contrato Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

// Declaramos nuestro contrato que, además de tener sus propios métodos también hereda de Ownable
contract TJoyTournaments is Ownable {
    // Declaramos la variable "nfts" en la que se almacenará la instancia de la interfaz de TJoyArcade
    ITJoyArcade private nfts;

    // Declaramos un struct Tournament
    // Este struct contiene las propiedades que necesita cada torneo
    struct Tournament {
        uint256 id;
        string name;
        bool active;
        uint256 duration;
    }

    // Declaramos un struct Score
    // Este struct tiene el id del torneo al que pertence y la puntuación propiamente dicha
    struct Score {
        uint256 tournamentId;
        uint256 score;
    }

    // Declaramos un mapeo para torneos con el id de cada torneo como clave y el torneo del tipo del struct Tournaments como valor
    mapping(uint256 => Tournament) tournaments;

    // El siguiente será un mapeo de jugadores y contendrá la address como clave y como valor un array de puntuaciones
    // Cada puntuación es un struct Score que contiene el id del torneo y la puntuación
    // Se pretende que el jugador pueda tener diferentes scores, uno para cada torneo en el que participe
    mapping(address => Score[]) players;

    // Esta variable la vamos a emplear para asignar ids secuenciales a los torneos
    uint256 nextTournamentId = 0;

    // La siguiente función es la que nos va a servir para instanciar en interfaz de TJoyArcade
    function setNfts(ITJoyArcade _nfts) public onlyOwner {
        nfts = _nfts;
    }

    // Esta es la función que nos permite crear un nuevo torneo
    // Sólo puede ser ejecutada si la llama el propietario del contrato
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

    // La siguiente función nos devuelve un torneo con toda su información
    function getTournament(uint256 _index)
        public
        view
        returns (Tournament memory)
    {
        return tournaments[_index];
    }

    // Esta es la función que permite al propietario iniciar un torneo
    function initTournament(uint256 _index) public payable onlyOwner {
        tournaments[_index].active = true;
    }

    // Esta función permite al propietario finalizar el torneo
    function endTournament(uint256 _index) public payable onlyOwner {
        tournaments[_index].active = false;
    }

    // Esta función permite a un usuario registrarse en un torneo
    // Los requerimientos son que posea, al menos, un nft de TJoyArcade y que no se encuentre ya registrado en ese mismo torneo
    function registerPlayer(uint256 _tournamentId, address _address)
        public
        payable
    {
        uint256 nftBalance = nfts.getNftBalance(_address);

        require(
            nftBalance > 0,
            "You must have a Tron Joy nft to join to a tournament"
        );

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

    // Esta función actualiza la puntuación del usuario dentro de un torneo
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

    // La siguiente función devuelve las puntuaciones de todos los torneos en los que ha participado un jugador
    function getPlayerScores(address _address)
        public
        view
        returns (Score[] memory)
    {
        return players[_address];
    }
}
