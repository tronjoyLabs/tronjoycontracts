const path = require("node:path");
const { appendFile } = require("fs");
const { tronWeb } = require("../tronWeb");
var TJoyTournaments = artifacts.require("./TJoyTournaments.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyTournaments);
  console.log("TJoyTournaments contract deployed");

  appendFile(
    path.join(__dirname, "../.env"),
    `TOURNAMENTS_ADDRESS=${tronWeb.address.fromHex(
      TJoyTournaments.address
    )}\nOWNER_PRIVATE_KEY=f017915411a0e7827e8f1f357c4ed2ccdcb1b1295cdb0fb0a5c13cbbd5da3734`,
    (error) => {
      if (error) {
        console.log(`Tournaments write file error: ${error}`);
      }
    }
  );
};
