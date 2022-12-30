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

    // Declaramos un array con los posibles estados del torneo
    string[] tournamentStates = [
        "Preparation",
        "Inscription",
        "Started",
        "Cancelled",
        "Finished"
    ];

    // Declaramos un struct Tournament
    // Este struct contiene las propiedades que necesita cada torneo
    struct Tournament {
        uint256 id;
        string name;
        string state;
        uint256 duration;
        address[] players;
    }

    // Declaramos un struct Score
    // Este struct tiene el id del torneo al que pertence y la puntuación propiamente dicha
    struct Score {
        uint256 tournamentId;
        uint256 score;
    }

    struct BestScore {
        address addr;
        uint256 score;
    }

    // Declaramos un mapeo para torneos con el id de cada torneo como clave y el torneo del tipo del struct Tournaments como valor
    mapping(uint256 => Tournament) tournaments;

    // El siguiente será un mapeo de jugadores y contendrá la address como clave y como valor un array de puntuaciones
    // Cada puntuación es un struct Score que contiene el id del torneo y la puntuación
    // Se pretende que el jugador pueda tener diferentes scores, uno para cada torneo en el que participe
    mapping(address => Score[]) players;

    mapping(uint256 => BestScore[]) tournamentsBests;

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
        address[] memory emptyPlayers;

        Tournament memory newTournament = Tournament({
            id: nextTournamentId,
            name: _name,
            state: tournamentStates[0],
            duration: _duration,
            players: emptyPlayers
        });

        tournaments[nextTournamentId] = newTournament;

        nextTournamentId += 1;
    }

    // La siguiente función nos devuelve un torneo con toda su información
    function getTournament(uint256 _id)
        public
        view
        returns (Tournament memory)
    {
        return tournaments[_id];
    }

    // Esta es la función que permite al propietario habilitar la inscripción
    function setInscription(uint256 _id) public payable onlyOwner {
        tournaments[_id].state = tournamentStates[1];
    }

    // Esta es la función que permite al propietario iniciar un torneo
    function initTournament(uint256 _id) public payable onlyOwner {
        tournaments[_id].state = tournamentStates[2];
    }

    // Esta función permite al propietario finalizar el torneo
    function endTournament(uint256 _id) public payable onlyOwner {
        require(tournaments[_id].id == _id, "Tournament does not exist");
        tournaments[_id].state = tournamentStates[4];
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

        tournaments[_tournamentId].players.push(_address);
    }

    // Esta función actualiza la puntuación del usuario dentro de un torneo
    function updatePlayerScore(uint256 _tournamentId, uint256 _score)
        public
        payable
    {
        //TODO restricción de mirar si la puntiación
        //TODO Gestionar posibles errores y requerir que la puntuación nueva sea mayor que la actual
        for (uint256 i = 0; i < players[msg.sender].length; i++) {
            if (
                players[msg.sender][i].tournamentId == _tournamentId &&
                _score > players[msg.sender][i].score
            ) {
                BestScore[] memory bestScores = tournamentsBests[_tournamentId];

                if (bestScores.length == 0) {
                    BestScore memory bestScore = BestScore({
                        addr: msg.sender,
                        score: _score
                    });

                    tournamentsBests[_tournamentId].push(bestScore);
                } else {
                    uint256 a;
                    uint256 key;
                    uint256 b;
                    for (a = 1; a < _score; a++) {
                        key = tournamentsBests[_tournamentId][a].score;

                        /* Move elements of arr[0..i-1], that are
                        greater than key, to one position ahead
                        of their current position */
                        while (
                            b >= 0 &&
                            tournamentsBests[_tournamentId][b].score > key
                        ) {
                            tournamentsBests[_tournamentId][
                                b + 1
                            ] = tournamentsBests[_tournamentId][b];
                            b = b - 1;
                        }
                        tournamentsBests[_tournamentId][b + 1].score = key;
                    }
                }

                players[msg.sender][i].score = _score;
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

    //TODO: para revisar
    // Esta función devuelve la puntuación de un jugador en un torneo concreto
    function getPlayerScore(uint256 _tournamentId, address _address)
        public
        view
        returns (uint256)
    {
        //Comprobar que el torneo existe
        require(
            tournaments[_tournamentId].id == _tournamentId,
            "Tournament does not exist"
        );

        //Comprobamos que el usuario esté registrado en el torneo
        require(
            players[_address].length > 0,
            "This account is not registered in this tournament"
        );

        Score[] memory playerScores = players[_address];

        bool scoreFound = false;
        uint256 index = 0;
        uint256 score = 0;

        while (!scoreFound && index < playerScores.length) {
            if (playerScores[index].tournamentId == _tournamentId) {
                score = playerScores[index].score;
                scoreFound = true;
            }
            index++;
        }

        return score;
    }

    //Obtener los mejores jugadores de un torneo
    function getTopPlayers(uint256 _tournamentId)
        public
        view
        returns (BestScore[] memory)
    {
        require(
            tournaments[_tournamentId].id == _tournamentId,
            "Tournament does not exist"
        );
        return tournamentsBests[_tournamentId];
    }

    //TODO: para revisar
    //Funcion para cambiar la fecha de inicio de un torneo
    // function changeStartDate(uint256 _tournamentId, uint256 _start_date)
    //     public
    //     payable
    //     onlyOwner
    // {
    //     //Comprobamos que el torneo exista
    //     require(
    //         tournaments[_tournamentId].id == _tournamentId,
    //         "Tournament does not exist"
    //     );

    //     //comprobamos que la fecha de inicio sea igual o mayor que la fecha actual
    //     require(
    //         _start_date >= block.timestamp,
    //         "Start date must be greater than current date"
    //     );
    //     tournaments[_tournamentId].start_date = _start_date;
    // }

    //TODO: para revisar
    //Funcion para cambiar la fecha de fin de un torneo
    // function changeDateTonEnd(uint256 _tournamentId, uint256 _end_date)
    //     public
    //     payable
    //     onlyOwner
    // {
    //     //Comprobamos que el torneo exista
    //     require(
    //         tournaments[_tournamentId].id == _tournamentId,
    //         "Tournament does not exist"
    //     );

    //     //comprobamos que la fecha de fin sea igual o mayor que la fecha de inicio
    //     require(
    //         _end_date >= tournaments[_tournamentId].start_date,
    //         "End date must be greater than start date"
    //     );

    //     //comprobamos que la fecha de fin sea igual o mayor que la fecha de hoy
    //     require(
    //         _end_date >= block.timestamp,
    //         "End date must be greater than current date"
    //     );

    //     tournaments[_tournamentId].end_date = _end_date;
    // }

    //TODO: para revisar
    //Obtener los 3 mejores jugadores de un torneo
    // function getTop3Players(uint256 _tournamentId)
    //     public
    //     view
    //     returns (Score[] memory)
    // {
    //     //Comprobar que el torneo existe
    //     require(
    //         tournaments[_tournamentId].id == _tournamentId,
    //         "Tournament does not exist"
    //     );

    //     //Comprobar que el torneo está finalizado
    //     require(
    //         keccak256(abi.encodePacked(tournaments[_tournamentId].state)) ==
    //             keccak256(abi.encodePacked("Finished")),
    //         "Tournament is not finished"
    //     );

    //     //Comprobar que hay al menos 3 jugadores registrados en el torneo
    //     require(
    //         tournaments[_tournamentId].players.length > 2,
    //         "There are not enough players to get the top 3"
    //     );

    //     //Obtenemos los jugadores del torneo
    //     address[] memory tournamentPlayers = tournaments[_tournamentId].players;

    //     //Creamos un array de puntuaciones para almacenar las puntuaciones de los jugadores
    //     Score[] memory tournamentScores = new Score[](
    //         tournaments[_tournamentId].players
    //     );

    //     //Recorremos el array de jugadores y obtenemos las puntuaciones de cada uno
    //     for (uint256 i = 0; i < tournamentPlayers.length; i++) {
    //         tournamentScores[i] = Score({
    //             tournamentId: _tournamentId,
    //             score: getPlayerScore(_tournamentId, tournamentPlayers[i])
    //         });
    //     }

    //     //Ordenamos el array de puntuaciones de mayor a menor
    //     for (uint256 i = 0; i < tournamentScores.length; i++) {
    //         for (uint256 j = i + 1; j < tournamentScores.length; j++) {
    //             if (tournamentScores[i].score < tournamentScores[j].score) {
    //                 Score memory temp = tournamentScores[i];
    //                 tournamentScores[i] = tournamentScores[j];
    //                 tournamentScores[j] = temp;
    //             }
    //         }
    //     }

    //     //Creamos un array de puntuaciones para almacenar las 3 mejores puntuaciones
    //     Score[] memory top3 = new Score[](3);

    //     //Copiamos las 3 primeras posiciones del array de puntuaciones ordenado
    //     for (uint256 i = 0; i < 3; i++) {
    //         top3[i] = tournamentScores[i];
    //     }

    //     return top3;
    // }
}
