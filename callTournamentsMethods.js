require("dotenv").config();
const TronWeb = require("tronweb");

const tronWeb = new TronWeb({
  fullHost: "http://127.0.0.1:9090",
  privateKey: process.env.OWNER_PRIVATE_KEY,
});

const instanceTournaments = async () => {
  const contract = await tronWeb.contract().at(process.env.TOURNAMENTS_ADDRESS);

  return contract;
};

const instanceMint = async () => {
  const contract = await tronWeb.contract().at(process.env.MINT_ADDRESS);

  return contract;
};

const init = async () => {
  const tournaments = await instanceTournaments();
  const mint = await instanceMint();

  const beginingDate = Date.now();

  const finishDate = beginingDate + 1000000;

  await tournaments
    .createTournament(
      10,
      30,
      100,
      beginingDate,
      finishDate,
      "TX5zDqPVvEq7eqVsVHb4N2k8MpzyuSwDYg"
    )
    .send({
      callValue: 100,
      feeLimit: 800000000,
      shouldPollResponse: false,
    });

  /* await mint.mint();

  await tournaments.registerPlayer(1000000000).send({
    callValue: 10,
    feeLimit: 800000000,
    shouldPollResponse: false,
  }); */

  process.exit(0);
};

init();
