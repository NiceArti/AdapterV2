//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract AdapterV2 
{
    using SafeERC20 for IERC20;

    address public immutable UniswapV2Router;
    address public immutable UniswapV2Factory;

    constructor(address router, address factory) {
        UniswapV2Router = router;
        UniswapV2Factory = factory;
    }

    function createPair(address _token0, address _token1) external {
        IUniswapV2Factory(UniswapV2Factory).createPair(_token0, _token1);
    }

    function addLiquidity(
        address token1,
        address token2,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        uint deadline
    ) external
    {
        IERC20(token1).safeTransferFrom(msg.sender,address(this),amountADesired);
        IERC20(token2).safeTransferFrom(msg.sender,address(this),amountBDesired);
        IERC20(token1).safeApprove(UniswapV2Router, amountADesired);
        IERC20(token2).safeApprove(UniswapV2Router, amountBDesired);

        IUniswapV2Router02(UniswapV2Router).addLiquidity(
            token1,
            token2,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            msg.sender,
            deadline
        );
    }


    function removeLiquidity(
        address token1,
        address token2,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        uint deadline
    ) external
    {
        address pair = IUniswapV2Factory(UniswapV2Factory).getPair(token1, token2);
        require(pair != address(0), "Adaptor: pair has not been created yet");
        IERC20(pair).safeApprove(UniswapV2Router, liquidity);
        IERC20(pair).safeTransferFrom(msg.sender, address(this), liquidity);


        IUniswapV2Router01(UniswapV2Router).removeLiquidity(
            token1,
            token2,
            liquidity,
            amountAMin,
            amountBMin,
            msg.sender,
            deadline
        );
    }


    function swap(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        uint256 deadline
    ) external{
        IERC20(path[0]).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(path[0]).safeApprove(UniswapV2Router, amountIn);
        IUniswapV2Router02(UniswapV2Router).swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            path,
            msg.sender,
            deadline
        );
    }

      // calculate price based on pair reserves
    function tokenPriceInPair(address pairAddress, uint amount)
        external
        view
        returns(uint price1, uint price2)
    {
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        (uint Res0, uint Res1,) = pair.getReserves();

        price1 = ((amount*Res0)/Res1); // return amount of token0 needed to buy token1
        price2 = ((amount*Res1)/Res0); // return amount of token0 needed to buy token1
    }
}
