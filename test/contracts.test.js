const TJoyArcade = artifacts.require("./TJoyArcade");
const TJoyGenetics = artifacts.require("./TJoyGenetics");
const TJoyMint = artifacts.require("./TJoyMint");

contract("Contracts testing", function (accounts) {
  let tJoyArcade;
  let tJoyGenetics;
  let tJoyMint;

  before(async function () {
    tJoyArcade = await TJoyArcade.deployed();

    tJoyGenetics = await TJoyGenetics.deployed();

    tJoyMint = await TJoyMint.deployed();

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
});
