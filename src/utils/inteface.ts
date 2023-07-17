export enum Networks {
    MAINNET = "MAINNET",
    TESTNET = "TESTNET",
    DEVNET = "DEVNET",
    AMM = "AMM"
  }



export enum EwalletConnectSupportedMethod {
  SINGLE_SIGN= "xrpl_signTransaction",
  MULTI_SIG_SIGN= "xrpl_signTransactionFor"
}



  export const EsupportedNewtworks = {
    MAINNET: {
      name: "Mainnet",
      networkWss: "wss://xrplcluster.com",
      walletconnectId: 'xrpl:0',
      rpc: "https://xrplcluster.com"
    },
    TESTNET: {
      name: "Testnet",
      networkWss: "wss://s.altnet.rippletest.net/",
      walletconnectId: 'xrpl:1',
      rpc: "https://testnet.xrpl-labs.com"
    },
  
    DEVNET: {
      name: "Devnet",
      networkWss: "wss://s.devnet.rippletest.net:51233/",
      walletconnectId: 'xrpl:2',
      rpc: "https://s.devnet.rippletest.net:51234/"
  
    }
}