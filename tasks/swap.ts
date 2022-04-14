import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {DEPLOYED_CONTRACT} from "./helpers"

task("swap", "adds liquidity between two tokens")
.addParam("amount", "address of token")
.addParam("amountOutMin", "address of token")
.addParam("address1", "Amount of lp tokens")
.addParam("address2", "Amount of lp tokens")
.setAction(async (taskArgs, hre) => 
{
    let time: any = new Date
    time /= 1000

    const contract = await hre.ethers.getContractAt("AdapterV2", DEPLOYED_CONTRACT); 
    
    await contract.swap(
        taskArgs.amount,
        taskArgs.amountOutMin,
        [taskArgs.address1, taskArgs.address2],
        parseInt(time) + 100000
    );

    console.log("true")
});