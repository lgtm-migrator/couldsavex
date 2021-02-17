import { Divider } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { setIntervalAsync } from "set-interval-async/fixed";

function LatestTX() {
  const [transactions, setTransactions] = useState(null);

  var fetchTransactions = async () => {
    let transc = await axios.get("http://localhost:3000/api/losses?limit=10");
    setTransactions(transc.data.result);
  };

  if (!transactions) fetchTransactions();

  return (
    <div>
      {transactions &&
        transactions.map((element) => {
          return (
            <>
              <div
                key={element.id}
                style={{
                  backgroundColor: "darkgray",
                  position: "relative",
                  left: -100,
                }}
              >
                <a href={"https://etherscan.io/address/" + element.sender}>
                  {element.sender.slice(0, 3) + element.sender.slice(18, 20)}
                </a>{" "}
                Could Save Upto{" "}
                <span style={{ color: "green" }}>
                  {element.OutcomeDiffPercent}%{" "}
                </span>
                or{" "}
                <span style={{ color: "green" }}>
                  {element.OutcomeDiff.toFixed(2) + " " + element.toToken + "s"}{" "}
                </span>
                at Transaction:{" "}
                <a href={"https://etherscan.io/tx/" + element.transactionid}>
                  {element.sender.slice(0, 3) + element.sender.slice(18, 20)}
                </a>{" "}
                By Using <a href={"https://1inch.exchange"}>1Inch</a> !
                <Divider></Divider>
              </div>
            </>
          );
        })}
    </div>
  );
}

export default LatestTX;
