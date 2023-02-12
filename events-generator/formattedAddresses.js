const TronWeb = require("tronweb");

const ownerTronWeb = new TronWeb({
  fullHost: process.env.HOST,
  privateKey: process.env.OWNER_ACCOUNT,
});

const formattedAddresses = {
  mintAddress: ownerTronWeb.address.fromHex(process.env.MINT_ADDRESS),
  tournamentsAddress: ownerTronWeb.address.fromHex(
    process.env.TOURNAMENTS_ADDRESS
  ),
  geneticsAddress: ownerTronWeb.address.fromHex(process.env.GENETICS_ADDRESS),
  arcadeAddress: ownerTronWeb.address.fromHex(process.env.ARCADE_ADDRESS),
};

module.exports = { formattedAddresses };
