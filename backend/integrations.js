const { LossesDB } = require("./dbUtils");
const { telegramInstance, oneInchChannelChatId } = require("./telegrambot");

exports.execIntegrations = async (
  swapExchange,
  transactionid,
  sender,
  fromToken,
  toToken,
  exchangeIncome,
  exchangeOutcome,
  oneInchOutcome,
  OutcomeDiff,
  OutcomeDiffPercent,
  timestamp
) => {
  await LossesDB.create({
    swapExchange: swapExchange,
    transactionid: transactionid,
    sender: sender,
    fromToken: fromToken,
    toToken: toToken,
    exchangeIncome: exchangeIncome,
    exchangeOutcome: exchangeOutcome,
    oneInchOutcome: oneInchOutcome,
    OutcomeDiff: OutcomeDiff,
    OutcomeDiffPercent: OutcomeDiffPercent,
    timestamp: timestamp,
  });

  await telegramInstance.sendMessage(
    oneInchChannelChatId,
    `
    <a href="${"https://etherscan.io/address/" + sender}">${
      sender.slice(0, 3) + sender.slice(18, 20)
    }</a> Could Save
    Upto <b>${OutcomeDiffPercent}%</b> or <b>${
      OutcomeDiff.toFixed(2) + " " + toToken + "s"
    }</b> at Transaction:
      <a href="${"https://etherscan.io/tx/" + transactionid}">${
      transactionid.slice(0, 3) + transactionid.slice(18, 20)
    }</a>
      By Using <a href="${"https://1inch.exchange"}">1Inch</a>!
  `,
    { parse_mode: "HTML" }
  );
};
