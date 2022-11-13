var TJoyGenetics = artifacts.require("./TJoyGenetics.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyGenetics);
  console.log("Genetics contract deployed");
};
