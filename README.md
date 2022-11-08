# instalacion
1. instalar tronbox
```
npm install -g tronbox
```
3. instalar openzeppelin
```
npm i
npm install @openzeppelin/contracts
```
4. reemplazar todas las funciones isContract por isContractTron desde visual Studio en la carpeta node_modules/@openzeppelin

# uso
Se puede trabajar en diferentes networs. De primeras trabajamos en local para no necesitar recursos. Para levantar un nodo en local de tron:
```
./start_node.sh
```
Una vez arrancado podemos lanzar el despliegue con:
```
tronbox migrate --reset
```
Si quisieramos otra red debemos especificarlo de la siguiente forma:
```
tronbox migrate --reset --network shata
```

Las configuraciones de las redes se introducen en tronbox.js
```
networks: {
    mainnet: {
      // Don't put your private key here:
      privateKey: process.env.PRIVATE_KEY_MAINNET,
      /*
Create a .env file (it must be gitignored) containing something like

  export PRIVATE_KEY_MAINNET=4E7FECCB71207B867C495B51A9758B104B1D4422088A87F4978BE64636656243

Then, run the migration with:

  source .env && tronbox migrate --network mainnet

*/
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: "https://api.trongrid.io",
      network_id: "1",
    },
    shasta: {
      privateKey: process.env.PRIVATE_KEY_SHASTA,
      userFeePercentage: 50,
      feeLimit: 1000 * 1e6,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "2",
    },
    nile: {
      privateKey: process.env.PRIVATE_KEY_NILE,
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: "https://api.nileex.io",
      network_id: "3",
    },
    development: {
      // For trontools/quickstart docker image
      privateKey:
        "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0",
      userFeePercentage: 0,
      feeLimit: 1000 * 1e6,
      fullHost: "http://127.0.0.1:" + port,
      network_id: "9",
    },
    compilers: {
      solc: {
        version: "0.8.6",
      },
    },
  },
```