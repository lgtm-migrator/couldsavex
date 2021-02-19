const TelegramBot = require("node-telegram-bot-api");

exports.oneInchChannelChatId = -1001243077083;
exports.telegramInstance = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

// Message Handling
this.telegramInstance.onText(/\/quote (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const params = match[1].split(",", 3);

  oneInchQuery = await fetch(
    `https://api.1inch.exchange/v2.0/quote?fromTokenAddress=${params[0]}&toTokenAddress=${params[1]}&amount=${params[2]}`,
    {
      method: "GET",
      retryOn: [1024],
      retries: 1,
      retryDelay: 10 * 10 ** 3,
    }
  )
    .then(async (res) => await res.json())
    .catch((err) => console.log(err));

  this.telegramInstance.sendMessage(
    chatId,
    `Return Amount: <b>${
      oneInchQuery.toTokenAmount + " " + oneInchQuery.toToken.symbol + "s"
    }</b>`,
    {
      parse_mode: "HTML",
    }
  );
});
