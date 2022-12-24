var TJoyTournaments = artifacts.require("./TJoyTournaments.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyTournaments);
  console.log("TJoyTournaments contract deployed");
};
