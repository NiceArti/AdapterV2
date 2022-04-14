# UniswapV2 adapter


- Link to deployed contract ETH: [link](https://kovan.etherscan.io/address/0xE569325b0510143C4f320c0603A637a794bE95bb#code)
- Contract address: 0xE569325b0510143C4f320c0603A637a794bE95bb


- OpenZeppelin library: [link](https://github.com/OpenZeppelin/openzeppelin-contracts)



## Try running some of the following tasks:

| Task | Description |
| --- | --- |
| `npx hardhat add-liquidity --address1 token1 --address2 token2 --amount1 n --amount2 n --amount-min1 n --amount-min2 --network kovan` | adds liquidity between two tokens |
| `npx hardhat remove-liquidity --address1 token1 --address2 token2 --liquidity n --amount-min1 n --amount-min2 --amount --network kovan` | removes liquidity between two tokens|
| `npx hardhat swap --amount n --amountOutMin n --address token1 --address token2 --network kovan` | swaps two tokens |