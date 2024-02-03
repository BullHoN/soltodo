require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { API_URL, PRIVATE_KEY, POLYGON_URL } = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0
    },
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    polygon: {
      url: POLYGON_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
