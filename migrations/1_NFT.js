const path = require("node:path");
const { appendFile } = require("fs");
const { tronWeb } = require("../tronWeb");
const TJoyArcade = artifacts.require("./TJoyArcade.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyArcade);
  console.log("Arcade contract deployed");

  appendFile(
    path.join(__dirname, "../.env"),
    `\nARCADE_ADDRESS=${tronWeb.address.fromHex(TJoyArcade.address)}\n`,
    (error) => {
      if (error) {
        console.log(`Arcade write file error: ${error}`);
      }
    }
  );
};
