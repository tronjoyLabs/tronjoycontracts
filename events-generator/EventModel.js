const mongoose = require("mongoose");
const mongooseLong = require("mongoose-long");

mongooseLong(mongoose);

const eventSchema = new mongoose.Schema(
  {
    block: Number,
    timestamp: mongoose.Schema.Types.Long,
    contract: String,
    name: String,
    transaction: String,
    result: {
      0: String,
      1: String,
      2: String,
      3: String,
      4: String,
      5: String,
      6: String,
      fee: String,
      beginingDate: String,
      initPool: String,
      price: String,
      tournamentId: String,
      finishDate: String,
      nft: String,
      owner: String,
      nftId: String,
      genetic: String,
      playerAddress: String,
      amount: String,
      reclaimable: Boolean,
    },
    resourceNode: String,
    unconfirmed: Boolean,
  },
  {
    collection: "events",
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
