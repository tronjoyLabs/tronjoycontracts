const path = require("node:path");
const { appendFile } = require("fs");
const { tronWeb } = require("../tronWeb");
var TJoyTournaments = artifacts.require("./TJoyTournaments.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyTournaments);
  console.log("TJoyTournaments contract deployed");

  appendFile(
    path.join(__dirname, "../.env"),
    `TOURNAMENTS_ADDRESS=${tronWeb.address.fromHex(TJoyTournaments.address)}\n`,
    (error) => {
      if (error) {
        console.log(`Tournaments write file error: ${error}`);
      }
    }
  );
};
