const TelegramBot = require("node-telegram-bot-api");
const { ArbSubsDB } = require("./dbUtils");

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

this.telegramInstance.onText(/\/subscribe (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const param = match[1];
  var subStatus = false;

  await ArbSubsDB.create({
    chatID: chatId,
    minArbPercent: param,
  }).catch((e) => {
    subStatus = true;
    this.telegramInstance.sendMessage(
      chatId,
      "You are already subscribed. \n Try /unsubscribe"
    );
  });

  if (!subStatus)
    this.telegramInstance.sendMessage(
      chatId,
      `You are now subscribed to Arbitrage Opportunities of over <b>${param}</b>%`,
      {
        parse_mode: "HTML",
      }
    );
});

this.telegramInstance.onText(/\/unsubscribe/, async (msg, match) => {
  const chatId = msg.chat.id;
  var subStatus = true;

  await ArbSubsDB.findOne({ where: { chatID: chatId } })
    .then((res) => {
      if (res === null) {
        subStatus = false;
        this.telegramInstance.sendMessage(
          chatId,
          "You are not subscribed. \n Try /subscribe"
        );
      } else {
        res.destroy();
      }
    })
    .catch((e) => console.log(e));

  if (subStatus)
    this.telegramInstance.sendMessage(
      chatId,
      `You are now unsubscribed to Arbitrage Opportunities`,
      {
        parse_mode: "HTML",
      }
    );
});
