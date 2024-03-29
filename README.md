# Tronjoy Contracts

<img src="./images/tronjoy-logo.png" alt="tronjoy-logo" />

## Descripción

Este repositorio contiene una colección de contratos acompañados de sus tests, herramientas de despliegue y scripts de lanzamientos de eventos.
La función principal de estos contratos es la de gestionar los torneos de la dapp de Tronjoy y el minteo de los nfts asociados.

## Primeros pasos

### Instalar tronbox en nuestra máquina de manera global

TronBox es una herramienta para desarrollar, probar e implementar contratos inteligentes. Está diseñado para cadenas de bloques que utilizan la máquina virtual TRON (TVM). Compilación, vinculación, implementación y administración binaria de contratos inteligentes incorporados.

Para instalarlo en nuestro sistema operativo utilizaremos el comando:

```sh
npm install -g tronbox
```

### Decargar el repositorio

Nos ubicaremos con nuestra terminal en el directorio en el que queramos que esté ubicado el proyecto y después ejecutarmos el siguiente comando:

```sh
http://gitlab.3fera.com/tronjoy/contracts-tron.git
```

### Instalar todos los paquetes de software necesarios

Dentro del direcorio raíz del proyecto ejecutaremos el comando:

```sh
npm i
```

### Adaptar los contratos de Open Zeppelin

OpenZeppelin es un conjunto de contratos inteligentes auditados y aprobados por su comunidad, completamente seguros y listos para ser utilizados en tus propios contratos. Al utilizar contratos de OpenZeppelin, obtienes los siguientes beneficios: Desarrollo de casos de uso complejos. Reducción del tiempo de desarrollo.

Si nos fijamos en nuestro package.json, tenemos declarado como dependencia open zeppelin, lo que significa que nuestra carpeta node_modules tiene que contener un directorio llamado @openzeppelin el cual contendrá los contratos.

Dichos contratos, están preparados para funcionar dentro de la máquina virtual de Ethereum. El problema que tenemos es que, en este caso, vamos a trabajar con la TVM (Tron Virtual Machine) por lo que tenemos que hacer una modificación que consistirá en reemplazar todas las funciones isContract por isContractTron desde visual Studio en la carpeta node_modules/@openzeppelin.

## Entornos de trabajo

Debido a las particularidades que presenta este desarrollo usaremos tres entornos de trabajo diferentes que vamos a explicar a continuación.

### Local

Cuando hablamos de entorno de trabajo local nos referimos a crear un nodo en nuestro propio equipo. Este nodo será el único de una TVM local que arrancaremos en un docker.

Este entorno será el que empleaaremos para realizar el testing y generar eventos que generen una colección de MngoDB que nos servirá para hacer pruebas en el backend de nuestra dapp.

### Testnet (Shasta)

Cuando estemos testeando nuestra dapp en desarrollo apuntaremos a los contratos inteligentes que tengamos desplegados en la red de pruebas.

### Red principal de tron (Tron Mainnet)

Aquí desplegaremos los contratos definitivos a los que apuntaremos en producción.

## Arranque del nodo local

Las instrucciones de descarga y arranque las tenemos en el siguiente repositorio: https://github.com/TRON-US/docker-tron-quickstart no obstante, vamos a repasar los comandos más importantes.

Como vamos a correr la TVM en un docker, en primer lugar debemos asegurarnos de tener Docker instalado y arrancado.

Una vez tengamos docker preparado en nuestro equipo ejecutaremos el comando:

```sh
./start_node.sh
```

Con ello ejecutaremos un archivo start_node.sh que se encuentra en la raíz de nuestro proyecto y que contiene una instrucción docker run para arrancar nuestro contenedor:

```sh
docker run -it --rm \
  -p 9090:9090 \
  -e "defaultBalance=100000" \
  -e "showQueryString=true" \
  -e "showBody=true" \
  -e "formatJson=true" \
  -e "mnemonic=treat nation math panel calm spy much obey moral hazard they sorry" \
  --name tron \
  trontools/quickstart
```

En en comando podemos apreciar que tenemos el contenedor corriendo en el puerto 9090 de nuestro contenedor y lo mapeamos al mismo 9090 de nuestro sistema operativo.

También podemos ver que utilizamos diferentes variables de entorno (opción -e). Las más importantes de estas variables de entorno son:

- defaultBalance: Se trata del balace por defecto de cada una de las cuentas que van a generase en nuestra TVM local.

- mnemonic: Es un conjunto de palabras que va a posibilitar que las cuentas generadas sean siempre las mismas de manera que no podremos hacer pruebas con la seguridad de que siempre vamos a emplear las mismas claves. Con esto nos ahorramos tener que cambiarlas cada vez que arranquemos de nuevo el nodo.

## Lanzamiento de los tests

Dentro de la carpeta test encontraremos un archivo llamado contracts.test.js. Es aquí donde se encuentran nuestros tests.

Para lanzar los tests es necesario haber arrancado previamente el nodo como explicamos anteriormente.

Para ejecutarlos ejecutaremos el siguiente comando:

```sh
tronbox test
```

Si los tests han dado resultado positivo la terminal mostrará una pantall similar a esta:

<img src="./images/test-result.png" alt="test-result" />

## Cómo migrar los contratos

Para poder llamar a los contratos en la máquina virtual primeramente hay que migrarlos. La cofiguración para realizar está migración debemos hacerla en el archivo tronbox.js que se encuentra en la raíz de nuestro proyecto.

A continuación vamos a mostrar cómo tendríamos el archivo configurado para hacer un despliegue en la TVM local o en la testnet de Shasta.

```js
module.exports = {
  networks: {
    shasta: {
      privateKey: process.env.SHASTA_OWNER_ACCOUNT,
      userFeePercentage: 50,
      feeLimit: 1000 * 1e6,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "2",
    },
    development: {
      privateKey: process.env.LOCAL_OWNER_ACCOUNT,
      userFeePercentage: 0,
      feeLimit: 1000 * 1e6,
      fullHost: "http://127.0.0.1:9090",
      network_id: "9",
    },
    compilers: {
      solc: {
        version: "0.8.6",
      },
    },
  },
};
```

Con este archivo correctamente configurado y el nodo arrancado (recordemos que podíamos ponerlo en marcha con < ./start_node.sh >) ya podemos hacer una migración a local (en las networks sería development).

Dentro de la carpeta scripts tenemos dos ejecutables local-migrate.sh y shasta-migrate.sh que nos permitirán migrar los contraos a las redes de localhost y shasta respectivamente.

Para migrar a la máquina virtual local ejecutaremos:

```sh
./scripts/local-migrate.sh
```

Si quisieramos migralo a Shasta lo haríamos de la siguiente forma:

```sh
./scripts/shasta-migrate.sh
```

## Lanzar los eventos para generar documentos en MongoDB:

Para trabajar en el desarrollo de nuestro backend nos conviene tener una base de datos de MongoDB poblada con eventos generados localmente que el producer pueda procesar.

Con el objetivo de escuchar los eventos y guardarlos en una colección de tron hemos preparado unos watchers.

Comentar que, previamente, deberemos de arrancar una base de datos de MongoDB en el puerto 27017 de nuestra máquina.

Una vez hecho esto, los pasos para generar estos eventos serán los siguientes:

- Arrancar el nodo de Tron:

```
sh start_node.sh
```

- Desplegar los contratos en nuestra red local:

```
sh scripts/local-migrate.sh
```

- Arrancar los watchers:

```
npm run watch
```

- Hacer llamadas a los contratos para generar eventos:

```
node events-generator/calls.js
```

Una vez terminado el proceso, deberíamos tener nuestra base de datos poblada con eventos como los que aparecen en la siguiente imágen.

<img src="./images/mongo-events.png" alt="mongo-events" />

## Contratos

### TJoyArcade

#### Métodos

<table>
  <thead>
    <th>Nombre</th>
    <th>Inputs</th>
    <th>Outputs</th>
    <th>Eventos</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>getNftBalance</td>
      <td>address _address</td>
      <td>uint256 balanceOf(_address)</td>
      <td></td>
      <td>Devuelve la cantidad de nfts de tipo Arcade que tiene esta address. Por cómo estamos gestionando el contrato deberá ser 0 o 1, ya que no se permite la acuñación de más de un nft por address.</td>
    </tr>
    <tr>
      <td>getGen</td>
      <td>uint256 _tokenId</td>
      <td>uint256 genetics[_tokenId]</td>
      <td></td>
      <td>Devuelve la genética de un nft en concreto a partir de su id.</td>
    </tr>
    <tr>
      <td>getTokenIdFromGen</td>
      <td>uint256 _gen</td>
      <td>uint256 tokenIdToGen[_gen]</td>
      <td></td>
      <td>Devuelve el id de un nft en concreto a partir de su genética.</td>
    </tr>
    <tr>
      <td>safeMint</td>
      <td>address to, uint256 gen</td>
      <td>uint256 tokenId</td>
      <td>NftMinted(to, tokenId, gen)</td>
      <td>Es el encargado de, mediante el llamado al método _safeMint del contrato ERC721, mintear el nuevo nft de tipo Arcade. Este método sólo puede ser llamado por un contrato que tenga asignado el rol de minter.</td>
    </tr>
  </tbody> 
</table>

#### Propiedades

<table>
  <thead>
    <th>Nombre</th>
    <th>Tipo</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>genetics</td>
      <td>mapping(uint256 => uint256)</td>
      <td>Se trata de un mapeo que asocia el id de un nft con su genética correspondiente.</td>
    </tr>
    <tr>
      <td>tokenIdToGen</td>
      <td>mapping(uint256 => uint256)</td>
      <td>Se trata de un mapeo que asocia la genética de un nft con su id correspondiente.</td>
    </tr>
    <tr>
      <td>_tokenIdCounter</td>
      <td>Counters.Counter</td>
      <td>Se trata de un struct que contiene una serie de propiedades que nos permiten gestionar el incremento de, en este caso, el id de un nuevo nft.</td>
    </tr>
  </tbody> 
</table>

#### Eventos

<table>
  <thead>
    <th>Nombre</th>
    <th>Parámetros</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>NftMinted</td>
      <td>address owner, uint256 nftId, uint256 genetic</td>
      <td>Este evento se lanza al ejecutarse la función safe mint y nos devolverá la información relativa al minteo de un token.</td>
    </tr>
  </tbody> 
</table>

### TJoyMint

#### Métodos

<table>
  <thead>
    <th>Nombre</th>
    <th>Inputs</th>
    <th>Outputs</th>
    <th>Eventos</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>mint</td>
      <td></td>
      <td></td>
      <td></td>
      <td>Desde esta función se llama al método safeMint de TJoyArcade con el objetivo de mintear un token. Podemos hacer esta llamada ya que este contrato tiene asignado el rol de minter.</td>
    </tr>
    <tr>
      <td>changeNfts</td>
      <td>ITJoyArcade _nfts</td>
      <td></td>
      <td></td>
      <td>Por medio de esta función le pasamos los métodos del contrato TJoyArcade que figuran en su correspondiente interfaz.</td>
    </tr>
    <tr>
      <td>changeGen</td>
      <td>ITJoyGenetics _gen</td>
      <td></td>
      <td></td>
      <td>Por medio de esta función le pasamos los métodos del contrato TJoyGenetics que figuran en su correspondiente interfaz.</td>
    </tr>
    <tr>
      <td>addWhitelists</td>
      <td>address[] memory wallets</td>
      <td></td>
      <td>AddressesWhitelisted(address[] addresses)</td>
      <td>Agregamos las addresses al array de owners con valor 1 (whitelisteado pero sin token minteado).</td>
    </tr>
    <tr>
      <td>getTotalOwners</td>
      <td></td>
      <td>uint256 totalMinted</td>
      <td></td>
      <td>Devuelve el número total de tokens minteados por el contrato.</td>
    </tr>
  </tbody> 
</table>

#### Propiedades

<table>
  <thead>
    <th>Nombre</th>
    <th>Tipo</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>gen</td>
      <td>ITJoyGenetics</td>
      <td>Esta propiedad almacena los métodos declarados en la interfaz de TJoyGenetics.</td>
    </tr>
    <tr>
      <td>nfts</td>
      <td>ITJoyArcade</td>
      <td>Esta propiedad almacena los métodos declarados en la interfact de TJoyArcade.</td>
    </tr>
    <tr>
      <td>totalMinted</td>
      <td>uint256</td>
      <td>Guarda el total de tokens minteados.</td>
    </tr>
    <tr>
      <td>maxMint</td>
      <td>uint256</td>
      <td>Guarda el máximo de tokens que el administrados determina que pueden mintearse. El valor es seteado en el constructor en el momento del deploy.</td>
    </tr>
    <tr>
      <td>owners</td>
      <td>mapping(address => uint256)</td>
      <td>Almacena las direcciones públicas de los propietarios asonciándolas a un valor 1 si están habilitadas para mintear un token (se encuentran dentro de la whitelist) y 2 si ya lo tienen minteado.</td>
    </tr>
  </tbody> 
</table>

### TJoyGenetics

#### Métodos

<table>
  <thead>
    <th>Nombre</th>
    <th>Inputs</th>
    <th>Outputs</th>
    <th>Eventos</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>getAvailable</td>
      <td>uint256[] memory</td>
      <td>uint256[] available</td>
      <td></td>
      <td>Devuelve las genéticas disponibles.</td>
    </tr>
    <tr>
      <td>addGenetic</td>
      <td>uint256 _gen</td>
      <td></td>
      <td></td>
      <td>Agrega una nueva genética al array de disponibles.</td>
    </tr>
    <tr>
      <td>addGenetics</td>
      <td>uint256[] memory _genetics</td>
      <td></td>
      <td></td>
      <td>Agrega una nuevas genéticas al array de disponibles.</td>
    </tr>
    <tr>
      <td>getUsed</td>
      <td></td>
      <td>uint256[] memory used</td>
      <td></td>
      <td>Devuelve las genéticas ya asignadas.</td>
    </tr>
    <tr>
      <td>totalUsed</td>
      <td></td>
      <td>uint256[] used.length</td>
      <td></td>
      <td>Devuelve el número total de genéticas asignadas.</td>
    </tr>
    <tr>
      <td>totalAvailable</td>
      <td></td>
      <td>uint256 available.length</td>
      <td></td>
      <td>Devuelve el número total de genéticas disponibles.</td>
    </tr>
    <tr>
      <td>extractGenetic</td>
      <td></td>
      <td>uint256 genetica</td>
      <td></td>
      <td>Devuelve la genética asignada de manera aleatoria para un nuevo nft.</td>
    </tr>
  </tbody> 
</table>

#### Propiedades

<table>
  <thead>
    <th>Nombre</th>
    <th>Tipo</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>available</td>
      <td>uint256[]</td>
      <td>Contiene un array con las genéticas disponibles.</td>
    </tr>
    <tr>
      <td>used</td>
      <td>uint256[]</td>
      <td>Contiene un array con las genéticas ya asignadas.</td>
    </tr>
    <tr>
      <td>lastMintedToken</td>
      <td>uint256</td>
      <td>Almacena la genética del último token minteado.</td>
    </tr>
  </tbody> 
</table>

### TJoyTournaments

#### Métodos

<table>
  <thead>
    <th>Nombre</th>
    <th>Inputs</th>
    <th>Outputs</th>
    <th>Eventos</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>getContractBalance</td>
      <td></td>
      <td>uint256 contractAddress.balance</td>
      <td></td>
      <td>Devuelve el balance del contrato.</td>
    </tr>
    <tr>
      <td>createTournament</td>
      <td>uint256 _price,
        uint256 _fee,
        uint256 _initPoolAmount,
        uint256 _beginingDate,
        uint256 _finishDate,
        IERC721 _nft</td>
      <td></td>
      <td>TournamentCreated</td>
      <td>Crea un nuevo torneo.</td>
    </tr>
    <tr>
      <td>updateTournament</td>
      <td>uint256 _tournamentId,
        uint256 _price,
        uint256 _fee,
        uint256 _initPoolAmount,
        uint256 _beginingDate,
        uint256 _finishDate,
        bool _paused,
        IERC721 _nft</td>
      <td></td>
      <td>TournamentUpdated</td>
      <td>Actualiza un torneo ya existente.</td>
    </tr>
    <tr>
      <td>registerPlayer</td>
      <td>uint256 _tournamentId</td>
      <td></td>
      <td>PlayerRegistered</td>
      <td>Registra un nuevo jugador en uno de los torneos previamente creados.</td>
    </tr>
    <tr>
      <td>addAward</td>
      <td>uint256 _tournamentId,
        address _player,
        uint256 _amount,
        uint256 _nftId,
        IERC721 _nft</td>
      <td></td>
      <td>AwardAdded</td>
      <td>Agrega un nuevo premio a un torneo ya existente.</td>
    </tr>
    <tr>
      <td>updateAward</td>
      <td>uint256 _tournamentId,
        address _player,
        uint256 _amount,
        uint256 _nftId,
        IERC721 _nft,
        bool _reclaimable</td>
      <td></td>
      <td>AwardUpdated</td>
      <td>Actualiza una de los premios ya incluídos en alguno de los torneos.</td>
    </tr>
    <tr>
      <td>reclaimAward</td>
      <td>uint256 _tournamentId</td>
      <td></td>
      <td>AwardReclaimed</td>
      <td>Reparte a un jugador el premio que ha ganado dentro de un determinado torneo.</td>
    </tr>
  </tbody> 
</table>

#### Propiedades

<table>
  <thead>
    <th>Nombre</th>
    <th>Tipo</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>contractOwner</td>
      <td>address</td>
      <td>Contiene la address propietaria del contrato.</td>
    </tr>
    <tr>
      <td>contractAddress</td>
      <td>address</td>
      <td>Contiene la dirección (clave pública) del contrato.</td>
    </tr>
    <tr>
      <td>businessBalance</td>
      <td>uint256</td>
      <td>La cantidad de TRX de la que dispone el owner de contrato fuera de los pooles.</td>
    </tr>
    <tr>
      <td>nextTournamentId</td>
      <td>uint256</td>
      <td>Es el id que asignaremos al siguiente torneo que se cree.</td>
    </tr>
    <tr>
      <td>awards</td>
      <td>uint256 => mapping(address => Award)</td>
      <td>Mapeo que asocia al id de un torneo otro mapeo que a su vez contiene un objeto de tipo Award asociado a la address de un jugador.</td>
    </tr>
    <tr>
      <td>tournaments</td>
      <td>uint256 => Tournament</td>
      <td>Mapeo que asocia al id de un torneo un objeto de tipo Tournament (que es el torneo en sí).</td>
    </tr>
  </tbody> 
</table>

#### Eventos

<table>
  <thead>
    <th>Nombre</th>
    <th>Parámetros</th>
    <th>Descripción</th>
  </thead> 
  <tbody>
    <tr>
      <td>TournamentCreated</td>
      <td>uint256 tournamentId,
        uint256 price,
        uint256 fee,
        uint256 initPool,
        uint256 beginingDate,
        uint256 finishDate,
        IERC721 nft</td>
      <td>Evento que se lanza cada vez que se ejecuta un nuevo torneo.</td>
    </tr>
    <tr>
      <td>TournamentUpdated</td>
      <td>uint256 tournamentId,
        uint256 price,
        uint256 fee,
        uint256 initPool,
        uint256 beginingDate,
        uint256 finishDate,
        IERC721 nft</td>
      <td>Evento que se lanza cada vez que se actualiza un torneo ya existente.</td>
    </tr>
    <tr>
      <td>PlayerRegistered</td>
      <td>uint256 tournamentId, address playerAddress</td>
      <td>Se emite este evento cada vez que se registra un nuevo jugador.</td>
    </tr>
    <tr>
      <td>Award added</td>
      <td>uint256 tournamentId,
        address playerAddress,
        uint256 amount,
        uint256 nftId,
        IERC721 nft</td>
      <td>Se emite este evento cada que un nuevo premio se asigna dentro de un torneo.</td>
    </tr>
    <tr>
      <td>Award updated</td>
      <td>uint256 tournamentId,
        address playerAddress,
        uint256 amount,
        uint256 nftId,
        IERC721 nft,
        bool reclaimable</td>
      <td>Se emite tras haber actualizado un torneo.</td>
    </tr>
  </tbody> 
</table>
