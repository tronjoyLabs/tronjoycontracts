var TJoyArcade = artifacts.require("./TJoyArcade.sol");
var TJoyGenetics = artifacts.require("./TJoyGenetics.sol");
var TJoyMint = artifacts.require("./TJoyMint.sol");

const TronWeb = require("tronweb");
var wait = require("../scripts/helpers/wait");

var fullHost = "https://api.trongrid.io/";
var tronWeb = new TronWeb(
  fullHost,
  fullHost,
  fullHost,
  "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0"
);

module.exports = async function (deployer) {
  console.info("Deploy Arcade token");
  await deployer.deploy(TJoyArcade);

  //console.info("Deploy Genetics token");
  await deployer.deploy(TJoyGenetics);

  console.info("Deploy Mint token");
  await deployer.deploy(TJoyMint, [10000]);
};
