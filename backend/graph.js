const fetch = require("fetch-retry")(require("isomorphic-fetch"));

exports.uniswap = async () => {
  let returnVals;

  try {
    const body = JSON.stringify({
      query: `{
        swaps(orderBy: timestamp, orderDirection: desc) {
          transaction {
            id
          }      
          pair {
            token0 {
              id
              symbol
            }
            token1 {
              id
              symbol
            }
          }
            amount0In
            amount1Out 
            timestamp
        }
      }`,
      variables: null,
    });

    const response = await fetch(
      "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      {
        method: "POST",
        body,
        retryDelay: 10 * 10 ** 3,
      }
    );

    const json = await response.json();
    returnVals = json.data.swaps;
  } catch (error) {
    console.log(error);
    returnVals = null;
  }

  return returnVals;
};
