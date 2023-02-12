require("dotenv").config();
const mongoose = require("mongoose");
const { tronWeb } = require("../tronWeb");
const TronEvent = require("./EventModel");

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log("Duelers-node database connected");
  })
  .catch((error) => {
    console.log(`Duelers-node database connection error: ${error}`);
  });

const instanceTournaments = async () => {
  const instance = await tronWeb.contract().at(process.env.TOURNAMENTS_ADDRESS);

  return instance;
};

const instanceArcade = async () => {
  const instance = await tronWeb.contract().at(process.env.ARCADE_ADDRESS);

  return instance;
};

const init = async () => {
  await TronEvent.deleteMany();

  const tournaments = await instanceTournaments();
  const arcade = await instanceArcade();

  arcade.NftMinted().watch(async (error, result) => {
    if (!error) {
      await TronEvent.create(result);

      console.log("Nft minted: ", result);
    } else {
      console.log(`Nft mint error: ${error}`);
    }
  });

  tournaments.TournamentCreated().watch(async (error, result) => {
    if (!error) {
      await TronEvent.create(result);

      console.log("Tournament created event: ", result);
    } else {
      console.log(`Tournament created event error: ${error}`);
    }
  });

  tournaments.PlayerRegistered().watch(async (error, result) => {
    if (!error) {
      await TronEvent.create(result);

      console.log("Player registered event: ", result);
    } else {
      console.log(`Player registered event error: ${error}`);
    }
  });

  tournaments.AwardAdded().watch((error, result) => {
    if (!error) {
      console.log("Award added event: ", result);
    } else {
      console.log(`Award added event error: ${error}`);
    }
  });

  tournaments.AwardUpdated().watch((error, result) => {
    if (!error) {
      console.log("Award updated event: ", result);
    } else {
      console.log(`Award updated event error: ${error}`);
    }
  });

  tournaments.AwardReclaimed().watch((error, result) => {
    if (!error) {
      console.log("Award reclaimed event: ", result);
    } else {
      console.log(`Award reclaimed event error: ${error}`);
    }
  });

  console.log("Watching Tron events");
};

init();
