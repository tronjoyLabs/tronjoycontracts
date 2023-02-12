const path = require("node:path");
const { appendFile } = require("fs");
const TJoyGenetics = artifacts.require("./TJoyGenetics.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyGenetics);
  console.log("Genetics contract deployed");

  appendFile(
    path.join(__dirname, "../.env"),
    `GENETICS_ADDRESS=${TJoyGenetics.address}\n`,
    (error) => {
      if (error) {
        console.log(`Genetics write file error: ${error}`);
      }
    }
  );
};
