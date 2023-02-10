require("dotenv").config();
const TronWeb = require("tronweb");

const tronWeb = new TronWeb({
  fullHost: "http://127.0.0.1:9090",
  privateKey: process.env.privateKey,
});

module.exports = { tronWeb };
