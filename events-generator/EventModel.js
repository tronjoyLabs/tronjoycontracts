const mongoose = require("mongoose");
const mongooseLong = require("mongoose-long");

mongooseLong(mongoose);

const tronEventSchema = new mongoose.Schema(
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
      id: String,
      genetic: String,
      playerAddress: String,
    },
    resourceNode: String,
    unconfirmed: Boolean,
  },
  {
    collection: "tronEvents",
  }
);

const TronEvent = mongoose.model("TronEvent", tronEventSchema);

module.exports = TronEvent;
