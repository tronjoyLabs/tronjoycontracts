var TJoyGenetics = artifacts.require("./TJoyGenetics.sol");

var wait = require("../scripts/helpers/wait");

module.exports = async function (deployer) {
  console.info("Deploy Genetics token");

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

  const getInfo = async () => {
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

  await getInfo();

  /* let totalAvailable = (await tJoyGenetics.totalAvailable()).toNumber();

  for (let i = 0; i < totalAvailable; i++) {
    await tJoyGenetics.extractGenetic();
    await getInfo();
  } */
};
