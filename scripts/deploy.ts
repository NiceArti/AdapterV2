import { ethers } from "hardhat";

async function main() {
  const AdapterV2 = await ethers.getContractFactory("AdapterV2");
  const adapterV2 = await AdapterV2.deploy("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D","0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");
  await adapterV2.deployed();
  console.log("AdapterV2 deployed to:", adapterV2.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
