const TJoyArcade = artifacts.require("./TJoyArcade");
const TJoyGenetics = artifacts.require("./TJoyGenetics");
const TJoyMint = artifacts.require("./TJoyMint");
const TJoyTournaments = artifacts.require("./TJoyTournaments");
const TronWeb = require("tronweb");

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

contract("Contracts testing", (accounts) => {
  let tJoyArcade;
  let tJoyGenetics;
  let tJoyMint;
  let tJoyTournaments;
  let tronWeb;

  const testAddress = accounts[0];

  before(async function () {
    tronWeb = new TronWeb({
      fullHost: "https://api.trongrid.io",
      privateKey:
        "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0",
    });

    tJoyArcade = await TJoyArcade.deployed();
    tJoyGenetics = await TJoyGenetics.deployed();
    tJoyMint = await TJoyMint.deployed();
    tJoyTournaments = await TJoyTournaments.deployed();

    await tJoyMint.changeNfts(TJoyArcade.address);
    await tJoyMint.changeGen(TJoyGenetics.address);
    await tJoyArcade.addMinter(tJoyMint.address);
    await tJoyGenetics.addMinter(tJoyMint.address);
    // await tJoyTournaments.setNfts(TJoyArcade.address);

    // await tJoyTournaments.injectFunds(1000, {
    //   callValue: 1000,
    //   from: tronWeb.address.fromHex(testAddress),
    // });
  });

  /* it("Get tournaments contract balance", async () => {
    const tournamentsBalance = await tJoyTournaments.getContractBalance();

    assert.isTrue(tournamentsBalance.toNumber() === 1000);
  }); */

  it("Add genetics to contract", async () => {
    let genetics = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    await tJoyGenetics.addGenetics(genetics);
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();

    assert.isTrue(available.length === 10);
    assert.isTrue(used.length === 0);
  });

  it("Mint an nft for an address", async () => {
    await tJoyMint.mint();
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 9);
    assert.isTrue(used.length === 1);
    assert.isTrue(totalMinted === 1);
  });

  it("Mint an nft for a second address", async () => {
    await tJoyMint.mint({ from: accounts[1] });
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 8);
    assert.isTrue(used.length === 2);
    assert.isTrue(totalMinted === 2);
  });

  it("Mint an nft for a third address", async () => {
    await tJoyMint.mint({ from: accounts[2] });
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 7);
    assert.isTrue(used.length === 3);
    assert.isTrue(totalMinted === 3);
  });

  it("Mint an nft for a fourth address", async () => {
    await tJoyMint.mint({ from: accounts[3] });
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 6);
    assert.isTrue(used.length === 4);
    assert.isTrue(totalMinted === 4);
  });

  it("Get nft banlance for the address which minted the previous token", async () => {
    const balance = await tJoyArcade.getNftBalance(testAddress);

    assert.isTrue(balance.toNumber() === 1);
  });

  it("Try to mint a second nft for our testing msg.sender default address", async () => {
    await tJoyMint.mint();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(totalMinted === 4);
  });

  it("Create a first tournament", async () => {
    const beginingDate = parseInt(Date.now() / 1000);
    const finishDate = beginingDate + 130;
    await tJoyTournaments.createTournament(
      10,
      30,
      100,
      beginingDate,
      finishDate,
      TJoyArcade.address,
      {
        callValue: 100,
      }
    );

    const tournament = await tJoyTournaments.getTournament(0);

    assert.isTrue(tournament.id.toNumber() === 0);
    assert.isTrue(tournament.paused === false);
    assert.isTrue(tournament.price.toNumber() === 10);
    assert.isTrue(tournament.fee.toNumber() === 30);
    assert.isTrue(tournament.initPool.toNumber() === 100);
    assert.isTrue(tournament.payPool.toNumber() === 0);
    assert.isTrue(tournament.beginingDate.toNumber() === beginingDate);
    assert.isTrue(tournament.finishDate.toNumber() === finishDate);
  });

  it("Register player in first tournament", async () => {
    await sleep(5000);
    await tJoyTournaments.registerPlayer(0, {
      callValue: 10,
    });
    await sleep(5000);

    const tournament = await tJoyTournaments.getTournament(0);
    const contractBalance = await tJoyTournaments.getContractBalance();
    const businessBalance = await tJoyTournaments.getBusinessBalance();

    assert.isTrue(tournament.id.toNumber() === 0);
    assert.isTrue(tournament.payPool.toNumber() === 7);
    assert.isTrue(businessBalance.toNumber() === 103);
    assert.isTrue(contractBalance.toNumber() === 110);
    assert.isTrue(true === true);
  });

  // it("Register player in 'test' tournament", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.registerPlayer(0, testAddress);
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(testAddress);
  //   const tournament = await tJoyTournaments.getTournament(0);
  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 0);
  //   assert.isTrue(tournament.players[0] === tronWeb.address.toHex(testAddress));
  // });

  // it("Update player score in 'test' tournament", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.updatePlayerScore(0, 3);
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(testAddress);
  //   const topScores = await tJoyTournaments.getTopPlayers(0);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 3);
  //   assert.isTrue(topScores.length === 1);
  //   assert.isTrue(topScores[0].score.toNumber() === 3);
  // });

  // it("Register player in 'test' tournament for a second time", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.registerPlayer(0, testAddress);
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(testAddress);
  //   const score = await tJoyTournaments.getPlayerScore(0, testAddress);

  //   assert.isTrue(playerScores.length === 1);
  //   assert.isTrue(score.toNumber() === 3);
  // });

  // it("Update player score in 'test' tournament without improvement", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.updatePlayerScore(0, 2);
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(testAddress);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 3);
  // });

  // it("Update player score in 'test' tournament with improvement", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.updatePlayerScore(0, 5);
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(testAddress);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 5);
  // });

  // it("Register a second player in 'test' tournament", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.registerPlayer(0, accounts[1]);
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(accounts[1]);
  //   const tournament = await tJoyTournaments.getTournament(0);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 0);
  //   assert.isTrue(tournament.players[1] === tronWeb.address.toHex(accounts[1]));
  // });

  // it("Update second player score in 'test' tournament", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.updatePlayerScore(0, 4, { from: accounts[1] });
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(accounts[1]);
  //   const topScores = await tJoyTournaments.getTopPlayers(0);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 4);
  //   assert.isTrue(topScores.length === 2);
  //   assert.isTrue(topScores[0].score.toNumber() === 5);
  // });

  // it("Update second player score in 'test' tournament with a lower score", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.updatePlayerScore(0, 1, { from: accounts[1] });
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(accounts[1]);
  //   const topScores = await tJoyTournaments.getTopPlayers(0);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 4);
  //   assert.isTrue(topScores.length === 2);
  //   assert.isTrue(topScores[0].score.toNumber() === 5);
  // });

  // it("Update second player score in 'test' tournament reaching the first position", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.updatePlayerScore(0, 7, { from: accounts[1] });
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(accounts[1]);
  //   const topScores = await tJoyTournaments.getTopPlayers(0);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 7);
  //   assert.isTrue(topScores.length === 2);
  //   assert.isTrue(topScores[0].score.toNumber() === 7);
  // });

  // it("Register a third player in 'test' tournament", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.registerPlayer(0, accounts[2]);
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(accounts[2]);
  //   const tournament = await tJoyTournaments.getTournament(0);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 0);
  //   assert.isTrue(tournament.players[2] === tronWeb.address.toHex(accounts[2]));
  // });

  // it("Update third player score in 'test' tournament", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.updatePlayerScore(0, 6, { from: accounts[2] });
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(accounts[2]);
  //   const topScores = await tJoyTournaments.getTopPlayers(0);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 6);
  //   assert.isTrue(topScores.length === 3);
  //   assert.isTrue(topScores[1].score.toNumber() === 6);
  // });

  // it("Register a fourth player in 'test' tournament", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.registerPlayer(0, accounts[3]);
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(accounts[3]);
  //   const tournament = await tJoyTournaments.getTournament(0);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 0);
  //   assert.isTrue(tournament.players[3] === tronWeb.address.toHex(accounts[3]));
  // });

  // it("Fourth player enters the top", async () => {
  //   await sleep(5000);
  //   await tJoyTournaments.updatePlayerScore(0, 15, { from: accounts[3] });
  //   await sleep(5000);
  //   const playerScores = await tJoyTournaments.getPlayerScores(accounts[3]);
  //   const topScores = await tJoyTournaments.getTopPlayers(0);

  //   assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
  //   assert.isTrue(playerScores[0].score.toNumber() === 15);
  //   assert.isTrue(topScores.length === 3);
  // });

  // it("Claim first reward", async () => {
  //   await sleep(20000);
  //   await tJoyTournaments.claimRewards(0, { from: accounts[3] });
  //   await sleep(5000);
  //   const contractBalance = await tJoyTournaments.getContractBalance();

  //   assert.isTrue(contractBalance.toNumber() === 900);
  // });
});
