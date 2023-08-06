# Xrpl wallet toolkit

A toolkit for interacting with all Xrpl wallets using a single, simple API. This library abstracts away the complexities of individual wallet configurations, allowing developers to focus on the frontend of their application.

The toolkit provides a unified interface for creating, accessing, and managing Xrpl transaction using wallets. The toolkit is easy to use and can be integrated into any application that needs to interact with Xrpl wallets. It is also open source, so developers can contribute to its development and make it even better.




Here is a short demo of the kit

<video src="kit_video.mp4" controls="controls" style="max-width: 730px;">
</video>




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

The transaction format for most wallets on the Kit follows the standard XRP Ledger transaction format, with the exception of Wallet Connect. When using Wallet Connect, you are required to specify the desired method type. To learn more about Wallet Connect on XRPL, you can visit this [link](https://docs.walletconnect.com/2.0/advanced/rpc-reference/xrpl-rpc). To sign a Wallet Connect transaction using the Kit, you need to provide the following information as shown in the example below.

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

For signing with other wallets, please provide a standard XRPL transaction.

- For other wallets,

```shell
  const client = await client.signTransaction({
      "TransactionType":"Payment",
      "Account":"accounts",
      "Destination":"r4MPsJ8SmQZGzk4dFxEoJHEF886bfX4rhu",
      "Amount":"13000000"
}) 
```


To disconnect or logout from a wallet, simply call the disconnect method of the class.

```shell

await client.disconnect()
```

We will be releasing more documentation on the kit in the near future. I hope this is helpful


<!-- TODO -->
<!-- - Update document to include response
- include possible ways of handling transaction response
- helper functions from the class -->