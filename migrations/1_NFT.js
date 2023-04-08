const path = require("node:path");
const { appendFile } = require("fs");
const TJoyArcade = artifacts.require("./TJoyArcade.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyArcade);
  console.log("Arcade contract deployed");

  console.log("Configure setBaseURI");
  const arcadeInstance = await TJoyArcade.deployed();
  await arcadeInstance.setBaseURI("https://tronjoy.s3.eu-west-3.amazonaws.com/arcades/");
  console.log("BaseURI configured");

  appendFile(
    path.join(__dirname, "../.env"),
    `ARCADE_ADDRESS=${TJoyArcade.address}\n`,
    (error) => {
      if (error) {
        console.log(`Arcade write file error: ${error}`);
      }
    }
  );
};
