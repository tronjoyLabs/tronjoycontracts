require("dotenv").config();
const { v4 } = require("uuid");
const mongoose = require("mongoose");
const Event = require("./EventModel");
const { instanceContracts } = require("./instanceContracts");

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log("Duelers-node database connected");
  })
  .catch((error) => {
    console.log(`Duelers-node database connection error: ${error}`);
  });

const init = async () => {
  await Event.deleteMany();

  const { tournamentsOwner, arcadeOwner } = await instanceContracts();

  arcadeOwner.NftMinted().watch(async (error, result) => {
    if (!error) {
      result._id = `${result.transaction}_${v4()}`;

      await Event.create(result);

      console.log("Nft minted: ", result);
    } else {
      console.log(`Nft mint error: ${error}`);
    }
  });

  tournamentsOwner.TournamentCreated().watch(async (error, result) => {
    if (!error) {
      result._id = `${result.transaction}_${v4()}`;

      await Event.create(result);

      console.log("Tournament created event: ", result);
    } else {
      console.log(`Tournament created event error: ${error}`);
    }
  });

  tournamentsOwner.TournamentUpdated().watch(async (error, result) => {
    if (!error) {
      result._id = `${result.transaction}_${v4()}`;

      await Event.create(result);

      console.log("Tournament updated event: ", result);
    } else {
      console.log(`Tournament updated event error: ${error}`);
    }
  });

  tournamentsOwner.PlayerRegistered().watch(async (error, result) => {
    if (!error) {
      result._id = `${result.transaction}_${v4()}`;

      await Event.create(result);

      console.log("Player registered event: ", result);
    } else {
      console.log(`Player registered event error: ${error}`);
    }
  });

  tournamentsOwner.AwardAdded().watch(async (error, result) => {
    if (!error) {
      result._id = `${result.transaction}_${v4()}`;

      await Event.create(result);

      console.log("Award added event: ", result);
    } else {
      console.log(`Award added event error: ${error}`);
    }
  });

  tournamentsOwner.AwardUpdated().watch(async (error, result) => {
    if (!error) {
      result._id = `${result.transaction}_${v4()}`;

      await Event.create(result);

      console.log("Award updated event: ", result);
    } else {
      console.log(`Award updated event error: ${error}`);
    }
  });

  tournamentsOwner.AwardReclaimed().watch(async (error, result) => {
    if (!error) {
      result._id = `${result.transaction}_${v4()}`;

      await Event.create(result);

      console.log("Award reclaimed event: ", result);
    } else {
      console.log(`Award reclaimed event error: ${error}`);
    }
  });

  console.log("Watching Tron events");
};

init();
