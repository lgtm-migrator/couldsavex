const { LossesDB } = require("./dbUtils");
const { uniswap } = require("./graph");
const { setIntervalAsync } = require("set-interval-async/fixed");
const fetch = require("fetch-retry")(require("isomorphic-fetch"));

let lastTimeStamp = Date.now() / 10 ** 3;

const toWei = 1 * 10 ** 18;

exports.lossCheck = async (CheckInterval) => {
  setIntervalAsync(async () => {
    const uniswaps = await uniswap();

    uniswaps.forEach(async (swap) => {
      try {
        if (swap.timestamp > lastTimeStamp && swap.amount0In > 0) {
          let exchangeOutcome = swap.amount1Out * toWei;
          let exchangeIncome = swap.amount0In * toWei;

          oneInchQuery = await fetch(
            `https://api.1inch.exchange/v2.0/quote?fromTokenAddress=${swap.pair.token0.id}&toTokenAddress=${swap.pair.token1.id}&amount=${exchangeIncome}`,
            {
              method: "GET",
              retryOn: [1024],
              retries: 1,
              retryDelay: 10 * 10 ** 3,
            }
          )
            .then(async (res) => await res.json())
            .catch((err) => console.log(err));

          if (exchangeOutcome && exchangeOutcome < oneInchQuery.toTokenAmount)
            await LossesDB.create({
              swapExchange: "uniswap",
              transactionid: swap.transaction.id,
              sender: await fetch(
                `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${swap.transaction.id}&apikey=${process.env.ETHERSCAN_API_KEY}`,
                {
                  method: "GET",
                  retryOn: async (attemp, error, response) => {
                    if (attemp > 1) return false;

                    var json = await response.json();
                    if (!json.status) return true;
                  },
                  retryDelay: 10 * 10 ** 3,
                }
              )
                .then(async (res) => await res.json())
                .catch((error) => console.log(error))
                .then((jsonres) => jsonres.result.from),
              fromToken: swap.pair.token0.id,
              toToken: swap.pair.token1.id,
              exchangeIncome: exchangeIncome,
              exchangeOutcome: exchangeOutcome,
              oneInchOutcome: oneInchQuery.toTokenAmount,
              OutcomeDiff: oneInchQuery.toTokenAmount - exchangeOutcome,
              timestamp: swap.timestamp,
            });
        }
      } catch (error) {
        console.log(error);
      }
    });
    lastTimeStamp = uniswaps[0].timestamp;
  }, CheckInterval);
};
