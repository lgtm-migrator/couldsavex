import { Select, MenuItem, TextField, Button } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";

function LossCalc() {
  const [tokens, setTokens] = useState(null);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [amount, setAmount] = useState(null);

  var fetchTokens = async () => {
    let toks = await axios.get(
      "https://api.coingecko.com/api/v3/exchanges/uniswap/tickers"
    );
    debugger;
    setTokens(toks.data.tickers);
  };

  if (!tokens) fetchTokens();

  return (
    <div>
      <p style={{ fontWeight: "bold" }}>Source Token:</p>
      <Select
        value={fromToken}
        onChange={(e) => setFromToken(e.target.value)}
        style={{ width: 300 }}
      >
        {tokens &&
          tokens.map((tok) => {
            return (
              <MenuItem value={tok.base} key={tok.base}>
                {tok.coin_id}
              </MenuItem>
            );
          })}
      </Select>
      <p style={{ fontWeight: "bold" }}>Target Token:</p>
      <Select
        value={toToken}
        onChange={(e) => setToToken(e.target.value)}
        style={{ width: 300 }}
      >
        {tokens &&
          tokens.map((tok) => {
            return (
              <MenuItem value={tok.base} key={tok.base}>
                {tok.coin_id}
              </MenuItem>
            );
          })}
      </Select>
      <p style={{ fontWeight: "bold" }}>Source Amount:</p>
      <TextField
        id="Amount"
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        variant="outlined"
      />
      <br></br>
      <Button
        variant="contained"
        style={{ backgroundColor: "darkgray", position: "relative", top: 10 }}
        onClick={() => alert("work In Progress!")}
      >
        Calculate the Loss!
      </Button>
    </div>
  );
}

export default LossCalc;
