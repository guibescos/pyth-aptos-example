import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { PriceServiceConnection, PriceFeed, HexString } from "@pythnetwork/pyth-common-js";
import {Buffer} from "buffer";
import {AptosClient} from "aptos"
import { AptosPriceServiceConnection } from "@pythnetwork/pyth-aptos-js";

const mintTransaction = {
  type: "entry_function_payload",
  function: `0x9de353175d88daee8ccfcc665bb4f5abd177e68b6f7cec0651313d2492878faf::minting::mint_nft`,
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
const APTOS_TESTNET_RPC = "https://testnet.aptoslabs.com/";
const PYTH_TABLE_HANDLE = "0x21b2122f77d3f9f944456c0ca8ffa6a13c541476433e64ab6ae81d48277a1181";
const aptosClient = new AptosClient(APTOS_TESTNET_RPC);

function App() {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  React.useEffect(() => {
    window.aptos.disconnect();
  }, []);

  const [pythOffChainPrice, setPythOffChainPrice] = React.useState<number>(0);
  const [pythOnChainPrice, setPythOnChainPrice] = React.useState<number>(0);

  const fetchOnChainPrice = async () => {
    let data = await aptosClient.getTableItem(PYTH_TABLE_HANDLE, {
      "key_type": "0xaa706d631cde8c634fe1876b0c93e4dec69d0c6ccac30a734e9e257042e81541::price_identifier::PriceIdentifier",
      "value_type": "0xaa706d631cde8c634fe1876b0c93e4dec69d0c6ccac30a734e9e257042e81541::price_info::PriceInfo",
      "key": { "bytes" : "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6"}
    });
    console.log(data);
    setPythOnChainPrice(data.price_feed.price.price.magnitude * 10 **(- data.price_feed.price.expo.magnitude))
  }

  React.useEffect(() => {
    fetchOnChainPrice();
  }, []);

  mainnetConnection.subscribePriceFeedUpdates([ETH_USD_MAINNET], (priceFeed: PriceFeed) => {
    setPythOffChainPrice(
      priceFeed.getCurrentPrice()?.getPriceAsNumberUnchecked() || 0
    );
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Mint your Pythian NFT</p>
        <p>Current offchain ETH/USD : {pythOffChainPrice.toFixed(3)}</p>
        <p>Current NFT price : {(100/pythOffChainPrice).toFixed(5)} APT</p>
        <p>Onchain ETH/USD : {pythOnChainPrice.toFixed(3)}</p>
        <div>
          <button
            onClick={async () => {
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
  const priceRefreshInstruction = {
    type: "entry_function_payload",
    function: PYTH_CONTRACT_TESTNET+ `::pyth::update_price_feeds_with_funder`,
    arguments: [priceFeedUpdateData],
    type_arguments: [],
  };
  await window.aptos.signAndSubmitTransaction(priceRefreshInstruction);
}

export default App;
