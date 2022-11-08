var TJoyArcade = artifacts.require("./TJoyArcade.sol");

var wait = require("../scripts/helpers/wait");

module.exports = async function (deployer) {
  console.info("Deploy Arcade token");
  await deployer.deploy(TJoyArcade);
};
