require("dotenv").config();
const { readFileSync } = require("fs");
const path = require("path");
const TronWeb = require("tronweb");

const init = async () => {
  try {
    console.log("Getting addresses from file");

    const addressesText = readFileSync(
      path.join(__dirname, "./resources/whitelisted.txt"),
      "utf8"
    );

    const addresses = addressesText.split("\n");

    console.log("We are going to add the following genetics:");
    console.log(addresses);

    console.log("The next step is creating a genetics contract instance");

    const ownerTronWeb = new TronWeb({
      fullHost: process.env.HOST,
      privateKey: process.env.OWNER_ACCOUNT,
    });

    const mintAddress = ownerTronWeb.address.fromHex(process.env.MINT_ADDRESS);

    const mintInstance = await ownerTronWeb.contract().at(mintAddress);

    console.log("We are about to inject the new whitelisted addresses");

    await mintInstance
      .addWhitelists(addresses)
      .send({ feeLimit: 800000000, shouldPollResponse: false });

    console.log(
      "Let's check if the addresses have been whitelisted successfully"
    );

    let errors = false;

    for (let i = 0; i < addresses.length; i++) {
      const addressState = await mintInstance.owners(addresses[i]).call();

      if (addressState.toNumber() === 1) {
        console.log(`Address ${addresses[i]} have been whitelisted correctly`);
      } else {
        console.log(`Address ${addresses[i]} have not been checked correctly`);
        errors = true;
      }
    }

    if (errors) throw new Error("Checking of whitelisted addresses not ok");

    process.exit(0);
  } catch (error) {
    console.log(`There is the following error in the process: ${error}`);
    process.exit(1);
  }
};

init();
