const fetch = require("node-fetch");

exports.uniswap = async () => {
  const body = JSON.stringify({
    query: `{
        swaps(orderBy: timestamp, orderDirection: desc) {
          pair {
            token0 {
              id
            }
            token1 {
              id
            }
          }
            sender
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
    }
  );

  const json = await response.json();
  const { swaps } = json.data;

  return swaps;
};
