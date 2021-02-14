import { LossesDB } from "./dbUtils";
import { uniswap } from "./graph";
import { setIntervalAsync } from "set-interval-async/fixed";

let lastTimeStamp = Date.now() / 10 ** 3;

exports.lossCheck = async (CheckInterval) => {
  setIntervalAsync(async () => {
    const uniswaps = await uniswap();

    uniswaps.forEach(async (swap) => {
      if (swap.timestamp > lastTimeStamp) {
        quoteBody = JSON.stringify({
          fromTokenAddress: swap.pair.token0.id,
          toTokenAddress: swap.pair.token1.id,
          amount: swap.amount0In,
        });

        oneInchQuery = await fetch("https://api.1inch.exchange/v2.0/quote", {
          method: "POST",
          quoteBody,
        }).then(async (res) => await res.json());

        await LossesDB.create({
          swapExchange: "uniswap",
          sender: swap.sender,
          fromToken: swap.pair.token0.id,
          toToken: swap.pair.token1.id,
          exchangeOutcome: swap.amount1Out,
          oneInchOutCome: oneInchQuery.toTokenAmount,
          timestamp: swap.timestamp,
        });
      }
    });

    lastTimeStamp = uniswaps[0].timestamp;
  }, CheckInterval);
};
