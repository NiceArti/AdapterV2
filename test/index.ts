import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  AdapterV2__factory,
  IUniswapV2Factory,
  IUniswapV2Router02,
  IUniswapV2Pair,
  Token,
  Token__factory
} from "../typechain"
import { BigNumber, constants, utils } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { parseUnits } from "ethers/lib/utils";
import * as helper from "./helper"

const MINIMUM_LIQUIDITY = 1000;


describe("AdapterV2", () => {
  let instance: any
  let token0: Token
  let token1: Token
  let owner: SignerWithAddress
  let UniswapV2Factory: IUniswapV2Factory
  let UniswapV2Router02: IUniswapV2Router02
  let UniswapV2Pair: IUniswapV2Pair
  let INITIAL_BALANCE: BigNumber
  let FIRST_LIQUIDITY: BigNumber
  
  // npx hardhat node --fork

  beforeEach(async () => {
    [owner] = await ethers.getSigners()

    token0 = await helper.createToken()
    token1 = await helper.createToken()

    UniswapV2Factory = <IUniswapV2Factory>(await ethers.getContractAt("IUniswapV2Factory", <string>process.env.FACTORY_ADDRESS));
    UniswapV2Router02 = <IUniswapV2Router02>(await ethers.getContractAt("IUniswapV2Router02",<string>process.env.ROUTER_ADDRESS));
    

    instance = await new AdapterV2__factory(owner).deploy(UniswapV2Router02.address, UniswapV2Factory.address);
    await instance.deployed();

    // INITIAL_BALANCE = utils.parseUnits("1000", await token0.decimals());
    // FIRST_LIQUIDITY = utils.parseUnits("100", await token0.decimals());
    // // Mint tokens
    // token0.mint(signer.address, INITIAL_BALANCE);
    // token1.mint(signer.address, INITIAL_BALANCE.mul(2));

    // // Create pair
    // await adaptor.createPair(token0.address, token1.address);
    // pair = <IUniswapV2Pair>(
    //   await ethers.getContractAt(
    //     "IUniswapV2Pair",
    //     await factory.getPair(token0.address, token1.address)
    //   )
    // );

    // // ! We need to approve the adaptor to debit our tokens
    // await token0.approve(instance.address, toEther(100));
    // await token1.approve(instance.address, toEther(200));

    // // addLiquidity
    // 
    // await instance.addLiquidity(
    //   token0.address,
    //   token1.address,
    //   FIRST_LIQUIDITY,
    //   FIRST_LIQUIDITY,
    //   parseUnits("100"),
    //   parseUnits("1000"),
    //   deadline
    // );
  });



  it("createPair(): should create pair", async () => {
    await instance.createPair(token0.address, token1.address);
    expect(await UniswapV2Factory.getPair(token0.address, token1.address)).to.be.properAddress;
  });


  it("addLiquidity(): should add liquidity between two ERC20 tokens", async () => {
    const DEADLINE = (await helper.currentTime()) + 100;
    const amount0 = parseUnits('100')
    const amount1 = parseUnits('10000')
    
    await token0.approve(instance.address, amount0)
    await token1.approve(instance.address, amount1)
    await instance.addLiquidity(
      token0.address,
      token1.address,
      amount0,
      amount1,
      parseUnits('0.0000001'),
      parseUnits('0.00001'),
      DEADLINE
    )

    UniswapV2Pair = <IUniswapV2Pair>(
      await ethers.getContractAt(
        "IUniswapV2Pair",
        await UniswapV2Factory.getPair(token0.address, token1.address)
      )
    );

    expect(await UniswapV2Pair.balanceOf(owner.address)).to.eq("999999999999999999000");
  })

  it("removeLiquidity(): should remove liquidity", async () => {
    const DEADLINE = (await helper.currentTime()) + 100;
    const amount0 = parseUnits('100')
    const amount1 = parseUnits('10000')
    
    // add liquidity
    await token0.approve(instance.address, amount0)
    await token1.approve(instance.address, amount1)
    await instance.addLiquidity(
      token0.address,
      token1.address,
      amount0,
      amount1,
      parseUnits('0.0000001'),
      parseUnits('0.00001'),
      DEADLINE
    )
    
    UniswapV2Pair = <IUniswapV2Pair>(
      await ethers.getContractAt(
        "IUniswapV2Pair",
        await UniswapV2Factory.getPair(token0.address, token1.address)
      )
    );
    
    let balance = await UniswapV2Pair.balanceOf(owner.address)
    expect(balance).to.eq("999999999999999999000");
  
    // remove liquidity
    await UniswapV2Pair.approve(instance.address, balance)
    await instance.removeLiquidity(
      token0.address,
      token1.address,
      balance,
      parseUnits('0.0000001'),
      parseUnits('0.00001'),
      DEADLINE
    )
    
    balance = await UniswapV2Pair.balanceOf(owner.address)
    expect(balance).to.eq(0);
  })
  
  it("swap(): should swap tokens", async () => {
    const DEADLINE = (await helper.currentTime()) + 100;

    const amount0 = parseUnits('100')
    const amount1 = parseUnits('10000')
    
    // add liquidity
    await token0.approve(instance.address, amount0)
    await token1.approve(instance.address, amount1)
    await instance.addLiquidity(
      token0.address,
      token1.address,
      amount0,
      amount1,
      parseUnits('0.0000001'),
      parseUnits('0.00001'),
      DEADLINE
    )

    let balanceBefore = await token1.balanceOf(owner.address)
    await token0.approve(instance.address, parseUnits("100"))
    await instance.swap(
      parseUnits("0.0000000000001"),
      parseUnits("0.00000000000000001"),
      [token0.address, token1.address],
      DEADLINE
      );
    
    
    let balanceAfter = await token1.balanceOf(owner.address)
    let isBigger = balanceBefore.lt(balanceAfter)
    expect(isBigger).to.eq(true);
  });

  it("tokenPriceInPair(): show price of token", async () => {
    const DEADLINE = (await helper.currentTime()) + 100;

    const amount0 = parseUnits('100')
    const amount1 = parseUnits('10000')
    
    // add liquidity
    await token0.approve(instance.address, amount0)
    await token1.approve(instance.address, amount1)
    await instance.addLiquidity(
      token0.address,
      token1.address,
      amount0,
      amount1,
      parseUnits('0.0000001'),
      parseUnits('0.00001'),
      DEADLINE
    )
    
    let pair = await UniswapV2Factory.getPair(token0.address, token1.address)
    let price = await instance.tokenPriceInPair(pair, parseUnits('1'))

    console.log(price.price1)
    expect(price.price1.mul('10000')).to.eq(price.price2)
  });

})