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

const accountTwoTronWeb = new TronWeb({
  fullHost: process.env.HOST,
  privateKey: process.env.ACCOUNT_TWO,
});

const accountThreeTronWeb = new TronWeb({
  fullHost: process.env.HOST,
  privateKey: process.env.ACCOUNT_THREE,
});

const instanceContracts = async () => {
  const tournamentsOwner = await ownerTronWeb.contract().at(tournamentsAddress);

  const tournamentsAccountOne = await accountOneTronWeb
    .contract()
    .at(tournamentsAddress);

  const tournamentsAccountTwo = await accountTwoTronWeb
    .contract()
    .at(tournamentsAddress);

  const tournamentsAccountThree = await accountThreeTronWeb
    .contract()
    .at(tournamentsAddress);

  const mintOwner = await ownerTronWeb.contract().at(mintAddress);

  const mintAccountOne = await accountOneTronWeb.contract().at(mintAddress);

  const mintAccountTwo = await accountTwoTronWeb.contract().at(mintAddress);

  const mintAccountThree = await accountThreeTronWeb.contract().at(mintAddress);

  const geneticsOwner = await ownerTronWeb.contract().at(geneticsAddress);

  const arcadeOwner = await ownerTronWeb.contract().at(arcadeAddress);

  return {
    tournamentsOwner,
    tournamentsAccountOne,
    tournamentsAccountTwo,
    tournamentsAccountThree,
    mintOwner,
    mintAccountOne,
    mintAccountTwo,
    mintAccountThree,
    geneticsOwner,
    arcadeOwner,
  };
};

module.exports = { instanceContracts };
