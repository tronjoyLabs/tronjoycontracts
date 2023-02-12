require("dotenv").config();
const TronWeb = require("tronweb");
const { formattedAddresses } = require("./formattedAddresses");

const { mintAddress, tournamentsAddress, geneticsAddress, arcadeAddress } =
  formattedAddresses;

const ownerTronWeb = new TronWeb({
  fullHost: process.env.HOST,
  privateKey: process.env.OWNER_ACCOUNT,
});

const accountOneTronWeb = new TronWeb({
  fullHost: process.env.HOST,
  privateKey: process.env.ACCOUNT_ONE,
});

const instanceContracts = async () => {
  const tournamentsOwner = await ownerTronWeb.contract().at(tournamentsAddress);

  const tournamentsAccountOne = await accountOneTronWeb
    .contract()
    .at(tournamentsAddress);

  const mintOwner = await ownerTronWeb.contract().at(mintAddress);

  const mintAccountOne = await accountOneTronWeb.contract().at(mintAddress);

  const geneticsOwner = await ownerTronWeb.contract().at(geneticsAddress);

  const arcadeOwner = await ownerTronWeb.contract().at(arcadeAddress);

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
