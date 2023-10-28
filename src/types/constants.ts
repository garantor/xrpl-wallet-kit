//network configuration
export const EsupportedNetworks = {
  MAINNET: {
    name: "Mainnet",
    networkWss: "wss://xrplcluster.com",
    walletconnectId: "xrpl:0",
    rpc: "https://xrplcluster.com",
  },
  TESTNET: {
    name: "Testnet",
    networkWss: "wss://s.altnet.rippletest.net:51233/",
    walletconnectId: "xrpl:1",
    rpc: "https://testnet.xrpl-labs.com",
  },

  DEVNET: {
    name: "Devnet",
    networkWss: "wss://s.devnet.rippletest.net:51233/",
    walletconnectId: "xrpl:2",
    rpc: "https://s.devnet.rippletest.net:51234/",
  },
};
