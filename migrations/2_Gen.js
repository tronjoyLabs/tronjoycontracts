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
  await tJoyGenetics.addGenetic(010101010101);
};
