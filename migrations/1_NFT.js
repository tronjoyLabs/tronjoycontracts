var wait = require("../scripts/helpers/wait");
var TJoyArcade = artifacts.require("./TJoyArcade.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyArcade);
  console.log("Arcade contract deployed");
};
