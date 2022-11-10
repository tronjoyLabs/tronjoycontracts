const port = process.env.HOST_PORT || 9090;

var TJoyArcade = artifacts.require("./TJoyArcade.sol");
var TJoyGenetics = artifacts.require("./TJoyGenetics.sol");
var TJoyMint = artifacts.require("./TJoyMint.sol");

var wait = require("../scripts/helpers/wait");
const keccak256 = require("keccak256");

const TronWeb = require("tronweb");
var fullHost = "http://127.0.0.1:" + port;
var tronWeb = new TronWeb(
  fullHost,
  fullHost,
  fullHost,
  "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0"
);

module.exports = async function (deployer) {
  console.info("Deploy Genetics token");
  await deployer.deploy(TJoyArcade);
  const tJoyArcade = await TJoyArcade.deployed();

  await deployer.deploy(TJoyGenetics);

  // esperamos a que se haya completado el deploy
  const tJoyGenetics = await TJoyGenetics.deployed();

  // Añadimos las geneticas
  // las tendremos en un csv, seguramente tendremos que leerlo y enviarlo por bucle
  // quizas vale la pena hacer una funcion que permita enviar un array de geneticas para hacer menos transacciones

  // El formato 0101010101 da problemas por tener un 0 como primer dígito

  let firstGenetic = 1111111;

  let numberOfGenetics = 5;

  for (let i = 1; i <= numberOfGenetics; i++) {
    await tJoyGenetics.addGenetic(firstGenetic);
    firstGenetic++;
  }

  let genetics = [2222221, 2222222, 2222223, 2222224, 2222225];

  await tJoyGenetics.addGenetics(genetics);

  console.info("Deploy Mint token");
  await deployer.deploy(TJoyMint, 10000);

  const tJoyMint = await TJoyMint.deployed();

  // asociamos el contrato de nfts con el que trabajamos
  await tJoyMint.changeNfts(TJoyArcade.address);
  // asociamos el contrato de geneticas
  await tJoyMint.changeGen(TJoyGenetics.address);
  // ponemos al minter como rol minter en el contrato del token
  await tJoyArcade.addMinter(tJoyMint.address);
  // ponemos al minter como rol minter en el contrato de la genetica
  await tJoyGenetics.addMinter(tJoyMint.address);

  const getInfo = async () => {
    console.log("mint response: ");
    let available = await tJoyGenetics.getAvailable();

    console.log("Available genetics:");

    available.forEach((element) => {
      console.log(element.toNumber());
    });
    console.log("\n");

    let used = await tJoyGenetics.getUsed();

    console.log("Used genetics:");

    used.forEach((element) => {
      console.log(element.toNumber());
    });
    console.log("\n");

    let totalAvailable = (await tJoyGenetics.totalAvailable()).toNumber();

    console.log("Total available: ", totalAvailable);

    let totalUsed = (await tJoyGenetics.totalUsed()).toNumber();

    console.log("Total used: ", totalUsed);
  };

  //await getInfo();

  const tx = await tJoyMint.mint();
  console.log(tx);
  await wait(10);
  console.log(await tronWeb.trx.getTransactionInfo(tx));
  console.log((await tJoyArcade.getGen(0)).toNumber());
  /*
  let totalAvailable = (await tJoyGenetics.totalAvailable()).toNumber();
  for (let i = 0; i < totalAvailable; i++) {
    await getInfo();
  }
  */
};