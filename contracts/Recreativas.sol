// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {

    // TODO: van a tener genetica tipo... 
    // 0102030405
    // 01 -> Fondo
    // 02 -> Frontal
    // 03 -> Lateral
    // 04 -> Botonera
    // 05 -> Debajo botonera
    // 06 -> Bordes de la recreativa
    // 
    // Almacenar todas las geneticas disponibles
    // 
    // Al generar un nuevo mint se tiene que escoger entre el pull genetico ya generado
    // 
    // Se escogera el nuevo de forma aleatoria o se introducira de forma aleatoria y se sacara secuencial
    // El segundo metodo puede dar problemas porque se puede trakear el orden en el que se ha introducido
    // El primer metodo puede dar problemas cuando queden pocos por repetir la busqueda de una genetica no usada
    // 
    // Revisar BTT por si interesa meter los nfts en la blockchain / pensando en el jurado
    // 
    // No limitamos el supply... lo gestionaremos en los contratos de minteo
    //
    
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MyToken", "MTK") {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}