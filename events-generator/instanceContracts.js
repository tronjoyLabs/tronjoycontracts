require("dotenv").config();
const TronWeb = require("tronweb");

const ownerTronWeb = new TronWeb({
  fullHost: process.env.HOST,
  privateKey: process.env.OWNER_ACCOUNT,
});

const accountOneTronWeb = new TronWeb({
  fullHost: process.env.HOST,
  privateKey: process.env.ACCOUNT_ONE,
});

const instanceContracts = async () => {
  const tournamentsOwner = await ownerTronWeb
    .contract()
    .at(process.env.TOURNAMENTS_ADDRESS);

  const tournamentsAccountOne = await accountOneTronWeb
    .contract()
    .at(process.env.TOURNAMENTS_ADDRESS);

  const mintOwner = await ownerTronWeb.contract().at(process.env.MINT_ADDRESS);

  const mintAccountOne = await accountOneTronWeb
    .contract()
    .at(process.env.MINT_ADDRESS);

  const geneticsOwner = await ownerTronWeb
    .contract()
    .at(process.env.GENETICS_ADDRESS);

  const arcadeOwner = await ownerTronWeb
    .contract()
    .at(process.env.ARCADE_ADDRESS);

  return {
    tournamentsOwner,
    tournamentsAccountOne,
    mintOwner,
    mintAccountOne,
    geneticsOwner,
    arcadeOwner,
  };
};

module.exports = { instanceContracts };
