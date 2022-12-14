import { ethers } from "hardhat";

async function main() {
  const address = "0x421f0897f2e07462b5a7b994abf8ae758dd0dd70";

  hre.changeNetwork("goerli");
  const nonce = await ethers.provider.getTransactionCount(address);
  const TARGET_ADDRESS = await ethers.utils.getContractAddress({
    from: address,
    nonce: nonce,
  });
  console.log("calculated target address", TARGET_ADDRESS);

  hre.changeNetwork("polygonMumbai");
  const POLYGON_CONNEXT_ADDRESS = "0xa2F2ed226d4569C8eC09c175DDEeF4d41Bab4627";
  const DESTINATION_DOMAIN_ID = 1735353714;
  const NFTSale = await ethers.getContractFactory("NFTSale");
  const nftSale = await NFTSale.deploy(POLYGON_CONNEXT_ADDRESS, TARGET_ADDRESS, DESTINATION_DOMAIN_ID);
  await nftSale.deployed();
  console.log(`NFT Sale Deployed to ${nftSale.address} at Polygon Mumbai`);

  hre.changeNetwork("goerli");
  const ORIGIN_DOMAIN_ID = 9991;
  const SOURCE =  nftSale.address;
  const G_CONNEXT_ADDRESS = "0xb35937ce4fFB5f72E90eAD83c10D33097a4F18D2";

  const NFT = await ethers.getContractFactory("NFTMainnet");
  const nft = await NFT.deploy(ORIGIN_DOMAIN_ID, SOURCE, G_CONNEXT_ADDRESS, process.env.EPNS_COMM_G, process.env.EPNS_CHANNEL, true);
  await nft.deployed();
  console.log(`NFTMainnet deployed to ${nft.address} at Goerli`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
