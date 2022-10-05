import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { PriceServiceConnection, PriceFeed, HexString } from "@pythnetwork/pyth-common-js";
import {Buffer} from "buffer";

class AptosPriceServiceConnection extends PriceServiceConnection {
  /**
   * Gets price update data which then can be submitted to the Pyth contract to update the prices.
   * This will throw an axios error if there is a network problem or the price service returns a non-ok response (e.g: Invalid price ids)
   *
   * @param priceIds Array of hex-encoded price ids.
   * @returns Array of price update data, serialized such that it can be passed to the Pyth Aptos contract.
   */
  async getPriceFeedsUpdateData(priceIds: HexString[]): Promise<number[]> {
    // Fetch the latest price feed update VAAs from the price service
    const latestVaas : string[]= await this.getLatestVaas(priceIds);
    let buffer = Buffer.from(latestVaas[0], "base64");
    return buffer.toJSON().data;
  }
}

const mintTransaction = {
  type: "entry_function_payload",
  function: `0xb138581594ebd7763cfa3c3e455050139b7304c6d41e7094a1c78da4e6761ed8::minting::mint_nft`,
  arguments: [],
  type_arguments: [],
};

const MAINNET_PRICE_SERVICE = "https://xc-mainnet.pyth.network";
const TESTNET_PRICE_SERVICE = "https://xc-testnet.pyth.network";
const mainnetConnection = new PriceServiceConnection(MAINNET_PRICE_SERVICE);
const testnetConnection = new AptosPriceServiceConnection(TESTNET_PRICE_SERVICE);
const ETH_USD_MAINNET =
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";
const ETH_USD_TESTNET = "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6";
const PYTH_CONTRACT_TESTNET = "0xaa706d631cde8c634fe1876b0c93e4dec69d0c6ccac30a734e9e257042e81541";

function App() {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  React.useEffect(() => {
    window.aptos.disconnect();
  }, []);

  const [onChainPrice, setOnChainPrice] = React.useState<number>(0);

  mainnetConnection.subscribePriceFeedUpdates([ETH_USD_MAINNET], (priceFeed: PriceFeed) => {
    setOnChainPrice(
      priceFeed.getCurrentPrice()?.getPriceAsNumberUnchecked() || 0
    );
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Mint your Pythian NFT</p>
        <p>Current offchain ETH/USD : {onChainPrice.toFixed(3)}</p>
        <p>Current NFT price : {(100/onChainPrice).toFixed(5)} APT</p>
        <p>Onchain ETH/USD :</p>
        <div>
          <button
            onClick={async () => {
              console.log("REFRESH");
              await sendRefreshPriceTransaction();
            }}
            disabled={!isConnected}
          >
            {" "}
            Refresh onchain price{" "}
          </button>
          <button
            onClick={async () => {
              setIsConnected(true);
              await window.aptos.connect();
              await window.aptos.isConnected();
            }}
            disabled={isConnected}
          >
            {" "}
            Connect{" "}
          </button>
          <button
            onClick={async () => {
              setIsConnected(false);
              await window.aptos.disconnect();
            }}
            disabled={!isConnected}
          >
            {" "}
            Disconnect{" "}
          </button>
          <button
            onClick={async () => {
              await window.aptos.signAndSubmitTransaction(mintTransaction);
            }}
            disabled={!isConnected}
          >
            {" "}
            Mint{" "}
          </button>{" "}
        </div>
      </header>
    </div>
  );
}

async function sendRefreshPriceTransaction(){
  const priceFeedUpdateData = await testnetConnection.getPriceFeedsUpdateData([ETH_USD_TESTNET]);
  console.log(priceFeedUpdateData);
  const priceRefreshInstruction = {
    type: "entry_function_payload",
    function: PYTH_CONTRACT_TESTNET+ `::pyth::update_price_feeds_with_funder`,
    arguments: [[priceFeedUpdateData]],
    type_arguments: [],
  };
  await window.aptos.signAndSubmitTransaction(priceRefreshInstruction);
}

export default App;
