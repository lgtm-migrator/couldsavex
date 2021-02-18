const ethers = require("ethers");
const uniswapABI = require("./ABI/uniswap.json");
const fetch = require("fetch-retry")(require("isomorphic-fetch"));

const Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3Provider);
const UniswapContract = new ethers.Contract(
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  uniswapABI,
  Provider
);
const WETHAddress = ethers.utils.getAddress(
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
);

const UniswapQuote = async (fromTokenAddress, toTokenAddress, Amount) => {
  let SwapPath;
  if (ethers.utils.getAddress(toTokenAddress) == WETHAddress)
    SwapPath = [fromTokenAddress, WETHAddress];
  else SwapPath = [fromTokenAddress, WETHAddress, toTokenAddress];

  return await UniswapContract.getAmountsOut(
    ethers.utils.parseEther(Amount),
    SwapPath
  );
};

exports.LossQuote = async (fromTokenAddress, toTokenAddress, Amount) => {
  const oneInchQuote = await fetch(
    `https://api.1inch.exchange/v2.0/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${ethers.utils.parseEther(
      Amount
    )}`,
    {
      method: "GET",
      retryOn: [1024],
      retries: 1,
      retryDelay: 10 * 10 ** 3,
    }
  )
    .then(async (res) => await res.json())
    .then((res) => ethers.utils.formatEther(res.toTokenAmount))
    .catch((err) => console.log(err));

  const UniQuote = await UniswapQuote(fromTokenAddress, toTokenAddress, Amount)
    .then((res) => ethers.utils.formatEther(res[res.length - 1]))
    .catch((err) => console.log(err));

  return ((oneInchQuote - UniQuote) / UniQuote) * 100;
};
