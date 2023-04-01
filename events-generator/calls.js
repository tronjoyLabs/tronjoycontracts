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
    tournamentsAccountTwo,
    tournamentsAccountThree,
    mintOwner,
    mintAccountOne,
    mintAccountTwo,
    mintAccountThree,
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

  await mintOwner
    .addWhitelists([
      "TEFccUNfgWyjuiiUo9LfNSb56jLhBo7pCV",
      "TTwP5QU2hCE3ho8WuNB811AD9jMTSoabKp",
      "TB9rhy2tVzp83mHU6G7DLFS2U1KYVaP5RZ",
      "TVxyvEH6DjbYcyygrSrURF88WZBjicWVD6",
    ])
    .send({
      feeLimit: 800000000,
      shouldPollResponse: false,
    });

  await sleep(5000);

  await mintOwner.mint().send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await mintAccountOne.mint().send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await mintAccountTwo.mint().send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await mintAccountThree.mint().send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  const ownerNftIdBigNumber = await arcadeOwner
    .tokenOfOwnerByIndex("TEFccUNfgWyjuiiUo9LfNSb56jLhBo7pCV", 0)
    .call();

  const ownerNftId = await ownerNftIdBigNumber.toNumber();

  await arcadeOwner
    .approve(formattedAddresses.tournamentsAddress, ownerNftId)
    .send({ feeLimit: 800000000, shouldPollResponse: false });

  await tournamentsOwner
    .createTournament(10, 30, 100, beginingDate, finishDate, arcadeAddress)
    .send({
      callValue: 100,
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

  await tournamentsOwner
    .updateTournament(
      1000000001,
      20,
      30,
      150,
      beginingDate,
      finishDate,
      false,
      arcadeAddress
    )
    .send({
      callValue: 50,
      feeLimit: 800000000,
      shouldPollResponse: false,
    });

  await sleep(5000);

  await tournamentsAccountOne.registerPlayer(1000000000).send({
    callValue: 10,
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await tournamentsAccountTwo.registerPlayer(1000000000).send({
    callValue: 10,
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  await tournamentsAccountThree.registerPlayer(1000000000).send({
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

  await tournamentsOwner
    .addAward(
      1000000000,
      "TB9rhy2tVzp83mHU6G7DLFS2U1KYVaP5RZ",
      0,
      ownerNftId,
      formattedAddresses.arcadeAddress
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

  await tournamentsAccountTwo.reclaimAward(1000000000).send({
    feeLimit: 800000000,
    shouldPollResponse: false,
  });

  process.exit(0);
};

init();
