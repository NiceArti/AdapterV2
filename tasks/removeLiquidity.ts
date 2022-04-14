import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {DEPLOYED_CONTRACT} from "./helpers"

task("remove-liquidity", "removes liquidity between two tokens")
.addParam("address1", "address of token")
.addParam("address2", "address of token")
.addParam("liquidity", "Amount of lp tokens")
.addParam("amountMin1", "Min Amount of tokens to remain in lp")
.addParam("amountMin2", "Min Amount of tokens to remain in lp")
.setAction(async (taskArgs, hre) => 
{
    let time: any = new Date
    time /= 1000

    const contract = await hre.ethers.getContractAt("AdapterV2", DEPLOYED_CONTRACT); 
    
    await contract.removeLiquidity(
        taskArgs.address1,
        taskArgs.address2,
        taskArgs.liquidity,
        taskArgs.amountMin1,
        taskArgs.amountMin2,
        parseInt(time) + 100000
    );

    console.log("true")
});