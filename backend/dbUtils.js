const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

exports.LossesDB = sequelize.define("Losses", {
  swapExchange: DataTypes.TEXT,
  sender: DataTypes.TEXT,
  fromToken: DataTypes.TEXT,
  toToken: DataTypes.TEXT,
  exchangeOutcome: DataTypes.INTEGER,
  oneInchOutCome: DataTypes.INTEGER,
  timestamp: DataTypes.INTEGER,
});
