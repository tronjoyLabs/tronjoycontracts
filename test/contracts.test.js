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
  let defaultAddress;
  let awardTokenId;

  const testAddress = accounts[0];

  before(async function () {
    tronWeb = new TronWeb({
      fullHost: "https://api.trongrid.io",
      privateKey:
        "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0",
    });

    defaultAddress = "0x0000000000000000000000000000000000000000";

    tJoyArcade = await TJoyArcade.deployed();
    tJoyGenetics = await TJoyGenetics.deployed();
    tJoyMint = await TJoyMint.deployed();
    tJoyTournaments = await TJoyTournaments.deployed();

    await tJoyMint.changeNfts(TJoyArcade.address);
    await tJoyMint.changeGen(TJoyGenetics.address);
    await tJoyArcade.addMinter(tJoyMint.address);
    await tJoyGenetics.addMinter(tJoyMint.address);
  });

  it("Add genetics to contract", async () => {
    let genetics = [
      1000000001, 1000000002, 1000000003, 1000000004, 1000000005, 1000000006,
      1000000007, 1000000008, 1000000009, 1000000010,
    ];
    await tJoyGenetics.addGenetics(genetics);
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();

    assert.isTrue(available.length === 10);
    assert.isTrue(used.length === 0);
  });

  it("Mint an nft for an address", async () => {
    await tJoyMint.mint({ from: accounts[1] });
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 9);
    assert.isTrue(used.length === 1);
    assert.isTrue(totalMinted === 1);
  });

  it("Mint an nft for a second address", async () => {
    await tJoyMint.mint({ from: accounts[2] });
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 8);
    assert.isTrue(used.length === 2);
    assert.isTrue(totalMinted === 2);
  });

  it("Mint an nft for a third address", async () => {
    await tJoyMint.mint({ from: accounts[3] });
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 7);
    assert.isTrue(used.length === 3);
    assert.isTrue(totalMinted === 3);
  });

  it("Mint an nft for a fourth address", async () => {
    await tJoyMint.mint({ from: accounts[4] });
    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(available.length === 6);
    assert.isTrue(used.length === 4);
    assert.isTrue(totalMinted === 4);
  });

  it("Mint an nft for an award", async () => {
    await tJoyMint.mint({
      from: testAddress,
    });

    const available = await tJoyGenetics.getAvailable();
    const used = await tJoyGenetics.getUsed();
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();
    const playerBalance = await tJoyArcade.getNftBalance(testAddress);
    awardTokenId = (await tJoyGenetics.lastMintedToken()).toNumber();

    assert.isTrue(available.length === 5);
    assert.isTrue(used.length === 5);
    assert.isTrue(totalMinted === 5);
    assert.isTrue(playerBalance.toNumber() === 1);
  });

  it("Get nft banlance for the address which minted the previous token", async () => {
    const balance = await tJoyArcade.getNftBalance(accounts[1]);

    assert.isTrue(balance.toNumber() === 1);
  });

  it("Try to mint a second nft for an address address", async () => {
    await tJoyMint.mint({ from: accounts[1] });
    const totalMinted = (await tJoyMint.getTotalOwners()).toNumber();

    assert.isTrue(totalMinted === 5);
  });

  it("Create a first payable tournament", async () => {
    const beginingDate = parseInt(Date.now() / 1000);
    const finishDate = beginingDate + 30;
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

    const tournament = await tJoyTournaments.getTournament(1000000000);

    assert.isTrue(tournament.id.toNumber() === 1000000000);
    assert.isTrue(tournament.paused === false);
    assert.isTrue(tournament.price.toNumber() === 10);
    assert.isTrue(tournament.fee.toNumber() === 30);
    assert.isTrue(tournament.initPool.toNumber() === 100);
    assert.isTrue(tournament.payPool.toNumber() === 0);
    assert.isTrue(tournament.beginingDate.toNumber() === beginingDate);
    assert.isTrue(tournament.finishDate.toNumber() === finishDate);
  });

  it("Register player in first payable tournament", async () => {
    await sleep(5000);
    await tJoyTournaments.registerPlayer(1000000000, {
      from: accounts[1],
      callValue: 10,
    });
    await sleep(5000);

    const tournament = await tJoyTournaments.getTournament(1000000000);
    const contractBalance = await tJoyTournaments.getContractBalance();
    const businessBalance = await tJoyTournaments.getBusinessBalance();

    assert.isTrue(tournament.id.toNumber() === 1000000000);
    assert.isTrue(tournament.payPool.toNumber() === 7);
    assert.isTrue(businessBalance.toNumber() === 103);
    assert.isTrue(contractBalance.toNumber() === 110);
  });

  it("Create a first non payable tournament", async () => {
    const beginingDate = parseInt(Date.now() / 1000);
    const finishDate = beginingDate + 130;
    await sleep(5000);
    await tJoyTournaments.createTournament(
      0,
      0,
      1000,
      beginingDate,
      finishDate,
      TJoyArcade.address,
      {
        callValue: 1000,
      }
    );
    await sleep(5000);

    const tournament = await tJoyTournaments.getTournament(1000000001);
    const contractBalance = await tJoyTournaments.getContractBalance();
    const businessBalance = await tJoyTournaments.getBusinessBalance();

    assert.isTrue(tournament.id.toNumber() === 1000000001);
    assert.isTrue(tournament.paused === false);
    assert.isTrue(tournament.price.toNumber() === 0);
    assert.isTrue(tournament.fee.toNumber() === 0);
    assert.isTrue(tournament.initPool.toNumber() === 1000);
    assert.isTrue(tournament.payPool.toNumber() === 0);
    assert.isTrue(tournament.distributed.toNumber() === 0);
    assert.isTrue(tournament.beginingDate.toNumber() === beginingDate);
    assert.isTrue(tournament.finishDate.toNumber() === finishDate);
    assert.isTrue(contractBalance.toNumber() === 1110);
    assert.isTrue(businessBalance.toNumber() === 1103);
  });

  it("Set first award (trx) in first non payable tournament", async () => {
    await sleep(5000);
    await tJoyTournaments.addAward(
      1000000000,
      accounts[1],
      20,
      0,
      defaultAddress
    );
    await sleep(5000);

    const tournamentAward = await tJoyTournaments.getTournamentAward(
      1000000000,
      accounts[1]
    );

    assert.isTrue(tournamentAward.amount.toNumber() === 20);
    assert.isTrue(tournamentAward.nftId.toNumber() === 0);
    assert.isTrue(
      tournamentAward.nft === tronWeb.address.toHex(defaultAddress)
    );
  });

  it("Set another award (nft) in first non payable tournament", async () => {
    await sleep(5000);
    await tJoyTournaments.addAward(
      1000000000,
      accounts[2],
      0,
      awardTokenId,
      TJoyArcade.address
    );
    await sleep(5000);

    const tournamentAward = await tJoyTournaments.getTournamentAward(
      1000000000,
      accounts[2]
    );

    assert.isTrue(tournamentAward.received === false);
    assert.isTrue(tournamentAward.amount.toNumber() === 0);
    assert.isTrue(tournamentAward.nftId.toNumber() === awardTokenId);
    assert.isTrue(
      tournamentAward.nft === tronWeb.address.toHex(TJoyArcade.address)
    );
  });

  it("Reclaim award from tournament", async () => {
    await sleep(5000);
    await tJoyTournaments.reclaimAward(1000000000, { from: accounts[1] });
    await sleep(5000);

    const tournament = await tJoyTournaments.getTournament(1000000000);
    const contractBalance = await tJoyTournaments.getContractBalance();

    assert.isTrue(contractBalance.toNumber() === 1090);
    assert.isTrue(tournament.distributed.toNumber() === 20);
  });

  it("Reclaim nft award from tournament", async () => {
    await sleep(5000);
    await tJoyTournaments.reclaimAward(1000000000, { from: accounts[2] });
    await sleep(5000);

    const contractBalance = await tJoyTournaments.getContractBalance();
    const playerBalance = await tJoyArcade.getNftBalance(accounts[2]);
    const ownerBalance = await tJoyArcade.getNftBalance(accounts[0]);
    const tournamentAward = await tJoyTournaments.getTournamentAward(
      1000000000,
      accounts[2]
    );

    console.log("Nfts del owner: ", ownerBalance.toNumber());
    console.log("Nfts del jugador: ", playerBalance.toNumber());

    assert.isTrue(contractBalance.toNumber() === 1090);
    assert.isTrue(tournamentAward.received === true);
  });
});
