const TJoyArcade = artifacts.require("./TJoyArcade");
const TJoyGenetics = artifacts.require("./TJoyGenetics");
const TJoyMint = artifacts.require("./TJoyMint");
const TJoyTournaments = artifacts.require("./TJoyTournaments");
const TronWeb = require("tronweb");

contract("Contracts testing", function (accounts) {
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
    await tJoyTournaments.setNfts(TJoyArcade.address);
  });

  it("Add genetics to contract", async function () {
    let genetics = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    await tJoyGenetics.addGenetics(genetics);
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();

    assert.isTrue(available.length === 10);
    assert.isTrue(used.length === 0);
  });

  it("Mint a first nft for an address", async () => {
    await tJoyMint.mint();
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 9);
    assert.isTrue(used.length === 1);
    assert.isTrue(totalMinted === 1);
  });

  it("Get nft banlance for the addres which minted the previous token", async () => {
    const balance = await tJoyArcade.getNftBalance(testAddress);
    assert.isTrue(balance.toNumber() === 1);
  });

  it("Try to int a second nft for an address", async () => {
    await tJoyMint.mint();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();
    assert.isTrue(totalMinted === 1);
  });

  it("Create a tournament named 'test'", async () => {
    await tJoyTournaments.createTournament("test", 5);

    const tournament = await tJoyTournaments.getTournament(0);

    assert.isTrue(tournament.id.toNumber() === 0);
    assert.isTrue(tournament.name === "test");
    assert.isTrue(tournament.state === "Preparation");
    assert.isTrue(tournament.duration.toNumber() === 5);
  });

  it("Change tournament state to inscription", async () => {
    await tJoyTournaments.setInscription(0);
    const tournament = await tJoyTournaments.getTournament(0);
    assert.isTrue(tournament.state === "Inscription");
  });

  it("Set created tournament state to started", async () => {
    await tJoyTournaments.initTournament(0);
    const tournament = await tJoyTournaments.getTournament(0);
    assert.isTrue(tournament.state === "Started");
  });

  it("Set created tournament state to finished", async () => {
    await tJoyTournaments.endTournament(0);
    const tournament = await tJoyTournaments.getTournament(0);
    assert.isTrue(tournament.state === "Finished");
  });

  it("Register player in 'test' tournament", async () => {
    await tJoyTournaments.registerPlayer(0, testAddress);
    const playerScores = await tJoyTournaments.getPlayerScores(testAddress);
    const tournament = await tJoyTournaments.getTournament(0);
    assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
    assert.isTrue(playerScores[0].score.toNumber() === 0);
    assert.isTrue(tournament.players[0] === tronWeb.address.toHex(testAddress));
  });

  it("Update player score in 'test' tournament", async () => {
    await tJoyTournaments.updatePlayerScore(0, 5, testAddress);
    const playerScores = await tJoyTournaments.getPlayerScores(testAddress);
    assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
    assert.isTrue(playerScores[0].score.toNumber() === 5);
  });

  it("Register player in 'test' tournament for a second time", async () => {
    await tJoyTournaments.registerPlayer(0, testAddress);
    const playerScores = await tJoyTournaments.getPlayerScores(testAddress);
    assert.isTrue(playerScores.length === 1);
  });
});
