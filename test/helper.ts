import { parseUnits } from "ethers/lib/utils";
import { BigNumber, constants, Signer } from "ethers";
import { ethers, waffle } from "hardhat";
import { Token, IUniswapV2Factory } from "../typechain";
import { Address } from "cluster";



export async function createToken()
{
    const Token = await ethers.getContractFactory("Token")
    let token: Token = await Token.deploy()
    await token.deployed()

    return token;
}

export async function increaseTime(value: any) {
    if (!ethers.BigNumber.isBigNumber(value)) {
        value = ethers.BigNumber.from(value);
    }
    await ethers.provider.send('evm_increaseTime', [value.toNumber()]);
    await ethers.provider.send('evm_mine', [value.toNumber()]);
}

export async function currentTime(){
    return (await ethers.provider.getBlock(ethers.provider.getBlockNumber())).timestamp;
}