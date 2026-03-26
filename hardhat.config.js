require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "https://rpc-amoy.polygon.technology"
    }
  }
};
