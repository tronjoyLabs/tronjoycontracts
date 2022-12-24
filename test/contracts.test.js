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

  it("Mint a first nft for an address", async function () {
    await tJoyMint.mint();

    const available = await tJoyGenetics.getAvailable();

    const used = await tJoyGenetics.getUsed();

    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 9);
    assert.isTrue(used.length === 1);
    assert.isTrue(totalMinted === 1);
  });

  it("Try to int a second nft for an address", async function () {
    await tJoyMint.mint();

    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(totalMinted === 1);
  });

  it("Create a tournament named 'test' and check it is correctly generated", async function () {
    await tJoyTournaments.createTournament("test");

    const tournaments = await tJoyTournaments.getTournaments();

    assert.isTrue(tournaments.length === 1);
    assert.isTrue(tournaments[0].index.toNumber() === 0);
    assert.isTrue(tournaments[0].name === "test");
  });

  it("Create another tournament called 'second-test and check its creation", async function () {
    await tJoyTournaments.createTournament("second-test");

    const tournaments = await tJoyTournaments.getTournaments();

    assert.isTrue(tournaments.length === 2);
    assert.isTrue(tournaments[1].index.toNumber() === 1);
    assert.isTrue(tournaments[1].name === "second-test");
  });

  it("Get a contract from mapping using its index", async function () {
    const tournament = await tJoyTournaments.getTournament(0);

    assert.isTrue(tournament.index.toNumber() === 0);
    assert.isTrue(tournament.name === "test");
  });
});
