var TJoyMint = artifacts.require("./TJoyMint.sol");

var wait = require("../scripts/helpers/wait");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyMint, 10000);
  console.log("Mint contract deployed");
};
