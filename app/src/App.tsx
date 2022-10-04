import React from 'react';
import logo from './logo.svg';
import './App.css';

const transaction = {
  type: "entry_function_payload",
  function: `0xb138581594ebd7763cfa3c3e455050139b7304c6d41e7094a1c78da4e6761ed8::minting::mint_nft`,
  arguments: [],
  type_arguments: [],
};

function App() {

  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  React.useEffect(() => {
    window.aptos.disconnect()
  }, []);

  
  return (
    
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Mint your Pythian NFT 
        </p>
        <div>
        <button onClick={async ()=> {setIsConnected(true); await window.aptos.connect(); await window.aptos.isConnected()}} disabled={isConnected}> Connect </button>
          <button onClick={async ()=> {setIsConnected(false); await window.aptos.disconnect()}} disabled={!isConnected}> Disconnect </button>
    <button onClick={async ()=> {await window.aptos.signAndSubmitTransaction(transaction)}} disabled={!isConnected}> Mint </button> </div>
      </header>
    </div>
  );
}

export default App;
