# Xrpl wallet toolkit

A toolkit for interacting with all Xrpl wallets using a single, simple API. This library abstracts away the complexities of individual wallet configurations, allowing developers to focus on the UI/UX of their application.

The toolkit provides a unified interface for creating, accessing, and managing Xrpl transaction using wallets. The toolkit is easy to use and can be integrated into any application that needs to interact with Xrpl wallets. It is also open source, so developers can contribute to its development and make it even better.


## Installation 
 ```shell
 npm i xrpl-wallet-kit
 ```
## Supported Wallets
The goal is to support as much wallet as we can to provide flexibility for dapp developer but initially the kit only support the following wallets;

- Xumm
- Gem Wallet
- Walletconnect v2(standalone)

If you would like to see more wallets supported, please raise an issue.


## Examples

To begin with, you need to create a single instance of the main class. This will ensure that all of the methods in the class are accessible and that unexpected results are avoided.

```shell

    import { XRPLKit, EsupportedWallet, Networks } from 'xrpl-wallet-kit';
    const client = new XRPLKit(EsupportedWallet.GEM, Networks.TESTNET)

```


## Connecting Dapps to wallets

To establish the initial connection with the wallets, you need to call the ```connectKitToWallet``` method of the previously initialized class, passing in the project ID or API key depending on the wallet you are connecting to.

For example, to connect to Xumm, you would use the following code:

```shell

clientSession = await client.connectKitToWallet(null, "apiKey for xumm connection")

```
Where apiKey is the project apikey for your Xumm account.

Once you have called the ```connectKitToWallet``` method, the wallet will be connected and you will be able to interact with it.

## Signing transaction

To request a wallet to sign a transaction, you can call the signTransaction method of the class, passing in the transaction you want to sign. The format of the transaction may vary depending on the wallet. 

- To send a walletconnect transaction for signing;

```shell
  const client = await client.signTransaction({
   "request":{
      "method":"the_wallet_connect_method",
      "params":{
         "tx_json":{
            "TransactionType":"Payment",
            "Account":"accounts",
            "Destination":"r4MPsJ8SmQZGzk4dFxEoJHEF886bfX4rhu",
            "Amount":"13000000"
         }
      }
   }
})  
```


For Xumm transaction

```shell
  const client = await client.signTransaction({
   "txjson":{
      "TransactionType":"Payment",
      "Account":"accounts",
      "Destination":"r4MPsJ8SmQZGzk4dFxEoJHEF886bfX4rhu",
      "Amount":"13000000"
   }
}) 
```

for Gem wallet payments transaction;


```shell
const client = await client.signTransaction({
    "destination": "r4MPsJ8SmQZGzk4dFxEoJHEF886bfX4rhu",
    "amount": "13000000"
    })
```

To disconnect or logout from a wallet, simply call the disconnect method of the class.
```shell
await client.disconnect()
```

We will be releasing more documentation on the kit in the near future. I hope this is helpful



