require("dotenv").config();
const mongoose = require("mongoose");
const { tronWeb } = require("./tronWeb");
const TronEvent = require("./TronEvent");

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://localhost:27017/duelers-node")
  .then(() => {
    console.log("Duelers-node database connected");
  })
  .catch((error) => {
    console.log(`Duelers-node database connection error: ${error}`);
  });

const instanceTournaments = async () => {
  const contract = await tronWeb.contract().at(process.env.TOURNAMENTS_ADDRESS);

  return contract;
};

const init = async () => {
  const tournaments = await instanceTournaments();

  tournaments.TournamentCreated().watch(async (error, result) => {
    if (!error) {
      await TronEvent.create(result);

      console.log("Tournament created event: ", result);
    } else {
      console.log(`Tournament created event error: ${error}`);
    }
  });

  tournaments.PlayerRegistered().watch((error, result) => {
    if (!error) {
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
};

init();
