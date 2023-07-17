import {XRPLKit, EsupportedNewtworks, EsupportedWallet } from "./Kit/kit";
import { Networks } from "./utils/inteface";
// async function App() {

//   const kit = new XRPLKit(EsupportedWallet.WALLETCONNECT, Networks.DEVNET)
  
// const kitValue = await kit.startWalletConnect()
// console.log("value that needs to be open ", kitValue.uri)
// console.log("value that approval ", kitValue.approval)
//   }

  
// export default App;

import { useEffect, useState } from "react";
import { SignClient } from "@walletconnect/sign-client";
import { Web3Modal } from "@web3modal/standalone";
import "../src/modal/App.css"



const projectId = '88bee4f36f4af99034b9c53c4d64c4a8'

const web3Modal = new Web3Modal({
  walletConnectVersion:2,
  projectId: projectId,
  standaloneChains: ["xrpl:1"],
});

function App() {
  const [signClient, setSignClient] = useState();
  const [kit, setKit ] = useState()
  const [sessions, setSessions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [txnHash, setTxnHash] = useState();

  async function createClient() {
    try {
      const kit = new XRPLKit(EsupportedWallet.WALLETCONNECT, Networks.TESTNET)
      const client = await kit.connectKitToWallet(projectId)

      setSignClient(client);
      setKit(kit)
      await subscribeToEvents(client);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleConnect() {
    if (!signClient) throw Error("Cannot connect. Sign Client is not created");
    try {
      let uri = signClient.uri
      
      console.log("this is the uri     ", uri)
      if (uri) {
        web3Modal.openModal({ uri });
        const sessionNamespace = await signClient.approval();
        onSessionConnect(sessionNamespace);
        web3Modal.closeModal();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function onSessionConnect(session) {
    console.log("this is the session ", session.namespaces.xrpl.accounts[0])
    if (!session) throw Error("session doesn't exist");
    try {
      setSessions(session);
      setAccounts(session.namespaces.xrpl.accounts[0].slice(7));
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDisconnect() {
    try {
      await signClient.disconnect({
        topic: sessions.topic,
        code: 6000,
        message: "User disconnected",
      });
      reset();
    } catch (e) {
      console.log(e);
    }
  }

  async function subscribeToEvents(client) {
    if (!client)
      throw Error("No events to subscribe to b/c the client does not exist");

    try {
      client.on("session_delete", () => {
        console.log("user disconnected the session from their wallet");
        reset();
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleSend() {
    try {
      const tx = {
        
            "tx_json": {
                "TransactionType": "Payment",
                "Account": accounts,
                "Destination":"rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
                "Amount": '100000000'
            
        }
      }

      const trans ={
        topic: sessions.topic,
          request: {
          "id": 1,
          "jsonrpc": "2.0",
          "method": "xrpl_signTransactionFor",
          "autofill":true,
          "submit":true,
          params: [tx]
        }


      } 
      
      // console.log("this destination address ", tx.Destination)
    
      const result = await kit.signTransaction(trans)
      console.log("report of the signed tx  --  ", result)
      
      
      
      // await signClient.request({
      //   topic: sessions.topic,
      //   request: {
      //     "id": 1,
      //     "jsonrpc": "2.0",
      //     "method": "xrpl_signTransaction",
      //     "autofill":true,
      //     "submit":true,
      //     params: [tx]
      //   },
      //   chainId: "xrpl:1"
      // })
      console.log("this is the transaction details ", result)
      console.log("this is the transaction details ", result.result.tx_json)
      console.log("this is the transaction details ", result.result.tx_json.transaction)
      console.log("this is the transaction details ", result.result.tx_json.transaction.result)
      console.log("this is the transaction details ", result.result.tx_json.transaction.result.hash)
      // console.log("this is the transaction details ", result.tx_json.transaction)
      // console.log("this is the transaction details ", result.tx_json.transaction.hash)
      setTxnHash(result.result.tx_json.transaction.result.hash)

    } catch (e) {
      console.log(e);
    }
  }

  const reset = () => {
    setAccounts([]);
    setSessions([]);
  };

  useEffect(() => {
    if (!signClient) {
      createClient();
    }
  }, [signClient]);

  return (
    <div className="App">
      <h1>Youtube Tutorial</h1>
      {accounts.length ? (
        <>
          <p>{accounts}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
          <button onClick={handleSend}>Send</button>
          { txnHash && <p>View your transaction <a href={`https://testnet.xrpl.org/transactions/${txnHash}`} target="_blank" rel="noreferrer">here</a>!</p>}
        </>
      ) : (
        <button onClick={handleConnect} disabled={!signClient}>
          Connect
        </button>
      )}
    </div>
  );
}

export default App;