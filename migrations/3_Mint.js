var TJoyArcade = artifacts.require("./TJoyArcade.sol");
var TJoyGenetics = artifacts.require("./TJoyGenetics.sol");
var TJoyMint = artifacts.require("./TJoyMint.sol");

var wait = require("../scripts/helpers/wait");

module.exports = async function (deployer) {
  console.info("Deploy Mint token");
  await deployer.deploy(TJoyMint, 10000);

  const tJoyMint = await TJoyMint.deployed();

  // asociamos el contrato de nfts con el que trabajamos
  await tJoyMint.changeNfts(TJoyArcade.address);
  // asociamos el contrato de geneticas
  await tJoyMint.changeGen(TJoyGenetics.address);
};
