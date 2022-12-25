const TJoyArcade = artifacts.require("./TJoyArcade");
const TJoyGenetics = artifacts.require("./TJoyGenetics");
const TJoyMint = artifacts.require("./TJoyMint");
const TJoyTournaments = artifacts.require("./TJoyTournaments");

contract("Contracts testing", function (accounts) {
  let tJoyArcade;
  let tJoyGenetics;
  let tJoyMint;
  let tJoyTournaments;

  before(async function () {
    tJoyArcade = await TJoyArcade.deployed();

    tJoyGenetics = await TJoyGenetics.deployed();

    tJoyMint = await TJoyMint.deployed();

    tJoyTournaments = await TJoyTournaments.deployed();

    await tJoyMint.changeNfts(TJoyArcade.address);

    await tJoyMint.changeGen(TJoyGenetics.address);

    await tJoyArcade.addMinter(tJoyMint.address);

    await tJoyGenetics.addMinter(tJoyMint.address);
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
    assert.isTrue(tournament.active === false);
    assert.isTrue(tournament.duration.toNumber() === 5);
  });

  it("Set created tournament state to active", async () => {
    await tJoyTournaments.initTournament(0);

    const tournament = await tJoyTournaments.getTournament(0);

    assert.isTrue(tournament.active === true);
  });

  it("Set created tournament state to no active", async () => {
    await tJoyTournaments.endTournament(0);

    const tournament = await tJoyTournaments.getTournament(0);

    assert.isTrue(tournament.active === false);
  });

  it("Register player in 'test' tournament", async () => {
    await tJoyTournaments.registerPlayer(
      0,
      "TLVi2DGjgfq6JDa7wXn9eASwpGJZVdcUN8"
    );

    const playerScores = await tJoyTournaments.getPlayerScores(
      "TLVi2DGjgfq6JDa7wXn9eASwpGJZVdcUN8"
    );

    assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
    assert.isTrue(playerScores[0].score.toNumber() === 0);
  });

  it("Update player score in 'test' tournament", async () => {
    await tJoyTournaments.updatePlayerScore(
      0,
      5,
      "TLVi2DGjgfq6JDa7wXn9eASwpGJZVdcUN8"
    );

    const playerScores = await tJoyTournaments.getPlayerScores(
      "TLVi2DGjgfq6JDa7wXn9eASwpGJZVdcUN8"
    );

    assert.isTrue(playerScores[0].tournamentId.toNumber() === 0);
    assert.isTrue(playerScores[0].score.toNumber() === 5);
  });
});
