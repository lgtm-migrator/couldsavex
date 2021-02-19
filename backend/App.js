require("dotenv").config();
const { Routing } = require("./routes");
const { lossCheck } = require("./lossCheck");
const { rotateDB, Databases } = require("./dbUtils");

// Databases
Databases.forEach(async (db) => {
  await db.sync({ alter: true });
});

// Backend
Routing();

// Checking
const interval = 3000; // ms
lossCheck(interval);

// Rotating
const rotateInterval = 120 * 10 ** 3;
const rotateKeepAmount = 100;
rotateDB(rotateKeepAmount, rotateInterval);
