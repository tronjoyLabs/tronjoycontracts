const path = require("node:path");
const { appendFile } = require("fs");
const { tronWeb } = require("../tronWeb");
var TJoyMint = artifacts.require("./TJoyMint.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyMint, 10000);
  console.log("Mint contract deployed");

  appendFile(
    path.join(__dirname, "../.env"),
    `MINT_ADDRESS=${tronWeb.address.fromHex(TJoyMint.address)}\n`,
    (error) => {
      if (error) {
        console.log(`Mint write file error: ${error}`);
      }
    }
  );
};
