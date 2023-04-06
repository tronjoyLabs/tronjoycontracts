require("dotenv").config();
const { readFileSync } = require("fs");
const path = require("path");
const TronWeb = require("tronweb");

const init = async () => {
  try {
    console.log("Getting genetics from file");

    const geneticsText = readFileSync(
      path.join(__dirname, "./resources/genetics.txt"),
      "utf8"
    );

    const genetics = geneticsText.split("\n");

    console.log("We are going to add the following genetics:");
    console.log(genetics);

    console.log("The next step is creating a genetics contract instance");

    const ownerTronWeb = new TronWeb({
      fullHost: process.env.HOST,
      privateKey: process.env.OWNER_ACCOUNT,
    });

    const mintAddress = ownerTronWeb.address.fromHex(
      process.env.GENETICS_ADDRESS
    );

    const geneticsInstance = await ownerTronWeb.contract().at(mintAddress);

    console.log("We are about to inject the genetics");

    await geneticsInstance
      .addGenetics(genetics)
      .send({ feeLimit: 800000000, shouldPollResponse: false });

    console.log("Let's get all the genetics");

    const availableGenetics = await geneticsInstance.getAvailable().call();

    let checkedGenetics = 0;

    for (let i = 0; i < availableGenetics.length; i++) {
      const contractGenetic = availableGenetics[i].toString();
      if (genetics.includes(contractGenetic)) {
        console.log(
          `This genetic has been send and has been found in our contract response: ${contractGenetic}`
        );
        checkedGenetics++;
      }
    }

    if (checkedGenetics === genetics.length) {
      console.log("All genetics have been successfully added");
    } else if (checkedGenetics > genetics.length) {
      console.log("Maybe, there are some repeated genetics");
    } else {
      throw new Error("Some genetics may have not been added. Check the logs");
    }

    process.exit(0);
  } catch (error) {
    console.log(`There is the following error in the process: ${error}`);
    process.exit(1);
  }
};

init();
