const Routing = require("./routes");
const lossCheck = require("./lossCheck");

// Backend
Routing();

// Checking
const interval = 3000; // ms
lossCheck(interval);
