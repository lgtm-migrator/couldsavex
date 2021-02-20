require("dotenv").config();
const { Routing } = require("./routes");
const { lossCheck } = require("./lossCheck");
const { rotateDB, Databases } = require("./dbUtils");

exports.App = () => {
  // Databases
  Databases.forEach(async (db) => {
    await db.sync({ alter: true });
  });

  // Rotating
  const rotateInterval = 120 * 10 ** 3;
  const rotateKeepAmount = 100;
  rotateDB(rotateKeepAmount, rotateInterval);

  // Checking
  const interval = 3000; // ms
  lossCheck(interval);

  // Backend
  const ExpressApp = Routing();
  ExpressApp.listen(process.env.PORT, () =>
    console.log("Server is running...")
  );
};

this.App();
