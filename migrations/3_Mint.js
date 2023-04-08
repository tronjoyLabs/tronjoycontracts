const path = require("node:path");
const { appendFile } = require("fs");
const TJoyMint = artifacts.require("./TJoyMint.sol");
const TJoyArcade = artifacts.require("./TJoyArcade.sol");
const TJoyGenetics = artifacts.require("./TJoyGenetics.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TJoyMint, 10000);
  console.log("Mint contract deployed");

  console.log("Configuring Mint contract");
  const mintInstance = await TJoyMint.deployed();
  await mintInstance.changeNfts(TJoyArcade.address);
  await mintInstance.changeGen(TJoyGenetics.address);

  console.log("Add permissions to mint at Arcade contract");
  const arcadeInstance = await TJoyArcade.deployed();
  await arcadeInstance.addMinter(TJoyMint.address);

  console.log("Add permissions to mint at Genetics contract");
  const geneticsInstance = await TJoyGenetics.deployed();
  await geneticsInstance.addMinter(TJoyMint.address);

  
  appendFile(
    path.join(__dirname, "../.env"),
    `MINT_ADDRESS=${TJoyMint.address}\n`,
    (error) => {
      if (error) {
        console.log(`Mint write file error: ${error}`);
      }
    }
  );
};
