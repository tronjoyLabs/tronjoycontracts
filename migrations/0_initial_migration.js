const path = require("node:path");
const { writeFile } = require("fs");
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  writeFile(
    path.join(__dirname, "../.env"),
    "MONGO_CONNECTION=mongodb://localhost:27017/duelers-node\nHOST=http://127.0.0.1:9090\nOWNER_ACCOUNT=f017915411a0e7827e8f1f357c4ed2ccdcb1b1295cdb0fb0a5c13cbbd5da3734\nACCOUNT_ONE=faa10a07e54457257532fbccad109f33e8426c70392ddd9c024bcde2406fc290\nACCOUNT_TWO=e8bf3aaa21ac204cbdbccc0dbc41390e390f5066b957b2b67bb3e68d3d4699b4\nACCOUNT_THREE=cee8ef926f1b6899e95dad66058a8adbaa91d87ffb9e6e64f56c772256848428\n",
    (error) => {
      if (error) {
        console.log(`Arcade write file error: ${error}`);
      }
    }
  );

  deployer.deploy(Migrations);
};
