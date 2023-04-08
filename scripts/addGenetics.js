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
    /*const genetics = [
      1000000001, 1000000002, 1000000003, 1000000004, 1000000005, 1000000006,
      1000000007, 1000000008, 1000000009, 1000000010,
    ];*/
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

    // Suponiendo que genetics es un array de string
    let geneticsBigNumber = [];
    
    const newGenetics = genetics.map( (gen) => {

      return gen;
      return (gen.slice(6));
    });


    await geneticsInstance
      .addGenetics(newGenetics)
      .send({ feeLimit: 800000000, shouldPollResponse: false });

   /* for (let i = 0; i < newGenetics.length; i++) {
      await geneticsInstance
      .addGenetic(parseInt(newGenetics[i]))
      .send({ feeLimit: 800000000, shouldPollResponse: true });
    }*/
    console.log(newGenetics);

   /* for (let i = 0; i < newGenetics.length; i++) {
      geneticsBigNumber.push(ownerTronWeb.toBigNumber((newGenetics[i])));
    }*/



    console.log("Let's get all the genetics");

    const availableGenetics = await geneticsInstance.getAvailable().call();

    let checkedGenetics = 0;

    for (let i = 0; i < availableGenetics.length; i++) {
      const contractGenetic = availableGenetics[i].toString();
      if (newGenetics.includes(contractGenetic)) {
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
    console.log(`There is the following error in the process:`, error);
    process.exit(1);
  }
};

init();
