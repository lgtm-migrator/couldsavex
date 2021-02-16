const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);
const { setIntervalAsync } = require("set-interval-async/fixed");

exports.LossesDB = sequelize.define("Losses", {
  swapExchange: DataTypes.TEXT,
  transactionid: DataTypes.TEXT,
  sender: { type: DataTypes.TEXT, defaultValue: "0x" },
  fromToken: DataTypes.TEXT,
  toToken: DataTypes.TEXT,
  exchangeIncome: DataTypes.FLOAT,
  exchangeOutcome: DataTypes.FLOAT,
  oneInchOutcome: DataTypes.FLOAT,
  OutcomeDiff: DataTypes.FLOAT,
  OutcomeDiffPercent: DataTypes.FLOAT,
  timestamp: DataTypes.INTEGER,
});

exports.rotateDB = (keepAmount, rotateinterval) => {
  setIntervalAsync(async () => {
    lossesCount = await this.LossesDB.count();
    oldCount = lossesCount - keepAmount;
    if (oldCount > 0)
      this.LossesDB.findAll({
        order: [["timestamp", "asc"]],
        limit: oldCount,
      })
        .then((losslist) => losslist.forEach((loss) => loss.destroy()))
        .catch((err) => console.log(err));
  }, rotateinterval);
};
