import { Select, MenuItem, TextField, Button } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import axios from "axios";
import { useState } from "react";

function LossCalc() {
  const [tokens, setTokens] = useState(null);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [amount, setAmount] = useState(null);
  const [loss, setLoss] = useState(null);

  var fetchTokens = async () => {
    let toks = await axios.get(
      "https://api.coingecko.com/api/v3/exchanges/uniswap/tickers"
    );
    setTokens(toks.data.tickers);
  };

  if (!tokens) fetchTokens();

  var swapLoss = async () => {
    let toks = await axios.get(
      `https://couldsavex.herokuapp.com/api/calcloss?fromToken=${fromToken}&toToken=${toToken}&amount=${amount}`
    );
    debugger;
    setLoss(toks.data.result.swaploss);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <p style={{ fontWeight: "bold" }}>Source Token:</p>
      <Select
        value={fromToken}
        onChange={(e) => setFromToken(e.target.value)}
        style={{ width: 300 }}
      >
        {tokens &&
          tokens.map((tok) => {
            return (
              <MenuItem value={tok.base.toLowerCase()} key={tok.base}>
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
              <MenuItem value={tok.base.toLowerCase()} key={tok.base}>
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
        onClick={async () => {
          await swapLoss();
        }}
      >
        Calculate the Loss!
      </Button>
      {loss ? (
        <p style={{ padding: "50px 0px" }}>
          You can save{" "}
          <span style={{ color: "green" }}>{loss.toFixed(2)}%</span> By Using{" "}
          <a href={"https://1inch.exchange"}>1Inch</a> !
        </p>
      ) : null}
    </div>
  );
}

export default LossCalc;
