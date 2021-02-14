const LossesDB = require("./dbUtils");

exports.Routing = async () => {
  /* Express */
  const express = require("express");
  const app = express();
  app.use(express.static("public"));

  // define the routes
  app.get("/api/losses", function (req, res) {
    const queryLimit = req.query.limit || 10;

    LossesDB.findAll({
      order: [["timestamp", "desc"]],
      limit: queryLimit,
    }).then((queryres) => res.send(queryres));
  });

  // start the server listening for requests
  app.listen(8000, () => console.log("Server is running..."));
};
