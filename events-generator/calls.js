require("dotenv").config();

const { instanceContracts } = require("./instanceContracts");

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const init = async () => {
  const {
    tournamentsOwner,
    tournamentsAccountOne,
    mintOwner,
    mintAccountOne,
    geneticsOwner,
    arcadeOwner,
  } = await instanceContracts();

  await mintOwner.changeNfts(process.env.ARCADE_ADDRESS).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await mintOwner.changeGen(process.env.GENETICS_ADDRESS).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await arcadeOwner.addMinter(process.env.MINT_ADDRESS).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await geneticsOwner.addMinter(process.env.MINT_ADDRESS).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  const beginingDate = parseInt(Date.now() / 1000);

  const finishDate = beginingDate + 30;

  const nftGenetics = [
    1000000001, 1000000002, 1000000003, 1000000004, 1000000005, 1000000006,
    1000000007, 1000000008, 1000000009, 1000000010,
  ];

  await geneticsOwner.addGenetics(nftGenetics).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await mintAccountOne.mint().send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await tournamentsOwner
    .createTournament(
      10,
      30,
      100,
      beginingDate,
      finishDate,
      process.env.ARCADE_ADDRESS
    )
    .send({
      callValue: 100,
      feeLimit: 800000000,
      shouldPollResponse: false,
    });

  await sleep(5000);

  await tournamentsAccountOne.registerPlayer(1000000000).send({
    callValue: 10,
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  process.exit(0);
};

init();
