const port = process.env.HOST_PORT || 9090;

module.exports = {
  networks: {
    mainnet: {
      // Don't put your private key here:
      privateKey: process.env.PRIVATE_KEY_MAINNET,
      /*
Create a .env file (it must be gitignored) containing something like

  export PRIVATE_KEY_MAINNET=4E7FECCB71207B867C495B51A9758B104B1D4422088A87F4978BE64636656243

Then, run the migration with:

  source .env && tronbox migrate --network mainnet

*/
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: "https://api.trongrid.io",
      network_id: "1",
    },
    shasta: {
      privateKey:
        "e2e39d1cfaf8ff68cf1e1cdff967e43f0d966e2e4fc4d69aeffa3407f9b329d5",
      userFeePercentage: 50,
      feeLimit: 1000 * 1e6,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "2",
    },
    nile: {
      privateKey: process.env.PRIVATE_KEY_NILE,
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: "https://api.nileex.io",
      network_id: "3",
    },
    development: {
      // For trontools/quickstart docker image
      privateKey:
        "f017915411a0e7827e8f1f357c4ed2ccdcb1b1295cdb0fb0a5c13cbbd5da3734",
      userFeePercentage: 0,
      feeLimit: 1000 * 1e6,
      fullHost: "http://127.0.0.1:9090",
      network_id: "9",
    },
    compilers: {
      solc: {
        version: "0.8.6",
      },
    },
  },
};
