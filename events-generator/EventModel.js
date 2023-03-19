const mongoose = require("mongoose");
const mongooseLong = require("mongoose-long");

mongooseLong(mongoose);

const eventSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    block: { type: Number, required: true },
    timestamp: { type: mongoose.Schema.Types.Long, required: true },
    contract: { type: String, required: true },
    name: { type: String, required: true },
    transaction: { type: String, required: true },
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
    resourceNode: { type: String, required: true },
    unconfirmed: { type: Boolean, required: true },
  },
  {
    collection: "events",
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
