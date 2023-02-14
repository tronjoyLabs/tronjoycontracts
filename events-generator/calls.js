require("dotenv").config();
const { formattedAddresses } = require("./formattedAddresses");

const { mintAddress, geneticsAddress, arcadeAddress } = formattedAddresses;

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

  await mintOwner.changeNfts(arcadeAddress).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await mintOwner.changeGen(geneticsAddress).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await arcadeOwner.addMinter(mintAddress).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await geneticsOwner.addMinter(mintAddress).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  const beginingDate = parseInt(Date.now() / 1000);

  const finishDate = beginingDate + 20;

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
    .createTournament(10, 30, 100, beginingDate, finishDate, arcadeAddress)
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

  await sleep(5000);

  await tournamentsOwner
    .addAward(
      1000000000,
      "TTwP5QU2hCE3ho8WuNB811AD9jMTSoabKp",
      100,
      0,
      "0x0000000000000000000000000000000000000000"
    )
    .send({
      feeLimit: 800000000,
      shouldPollResponse: false,
    });

  await sleep(5000);

  await tournamentsOwner
    .updateAward(
      1000000000,
      "TTwP5QU2hCE3ho8WuNB811AD9jMTSoabKp",
      50,
      0,
      "0x0000000000000000000000000000000000000000",
      true
    )
    .send({
      feeLimit: 800000000,
      shouldPollResponse: false,
    });

  await sleep(5000);

  await tournamentsAccountOne.reclaimAward(1000000000).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  process.exit(0);
};

init();
