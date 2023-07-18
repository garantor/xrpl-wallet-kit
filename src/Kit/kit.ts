import { createWalletConnectClient, signWalletConnectTx } from "./WalletConnect/walletconnect";
import * as XRPL from 'xrpl'
import { Networks, EsupportedNewtworks, EwalletConnectSupportedMethod } from "../utils/inteface";
import { xummInit, signedXummTransaction } from './XummWallet/xumm'
import { Xumm } from "xumm";
import { EsupportedWallet } from "../utils/Enums";

export class XRPLKit {
  private selectedWallet!: EsupportedWallet;
  private network!: Networks;
  private Client: any
  private XummInstance!: Xumm;

  // general way to initialize wallet
  constructor(
    selectedWallet: EsupportedWallet,
    network: Networks,
  ) {
    this.addWallet(selectedWallet);
    this.addNetwork(network);
  }


  //sign wallet connect tx
  private async signWalletConnectTx(transaction: XRPL.TxRequest) {
    const selectedNetwork = EsupportedNewtworks[this.network as unknown as keyof typeof EsupportedNewtworks]

    const result = {
      client: this.Client,
      topic: transaction.topic as string,
      request: transaction.request,
      chainId: selectedNetwork.walletconnectId
    }
    return await signWalletConnectTx(result)

  }


  public addNetwork(network: Networks): void {
    const supportedNetworks = Object.values(Networks);

    if (!supportedNetworks.includes(network)) {
      throw new Error(`Wallet network "${network}" is not supported`);
    }

    this.network = network;
  }


  public addWallet(wallet: EsupportedWallet): void {
    const supportedWallet = Object.values(EsupportedWallet);
    if (!supportedWallet.includes(wallet)) {
      throw new Error(`Wallet type "${wallet}" is not supported`);
    }

    this.selectedWallet = wallet;
  }

  public async connectKitToWallet(projectId?: string, apiKey?: string) {
    // connectKitToWallet is how you initially connect to a specific wallet
    // project id can be any number or string, make sure it valid when connecting to wallet connect
    // projectId is only for walletconnect
    let network = this.network
    let useWallet = this.selectedWallet
    switch (useWallet) {
      case EsupportedWallet.XUMM:
        //handle xumm connect here
        this.XummInstance = await xummInit(apiKey!)
        return this.XummInstance
      case EsupportedWallet.GEM:
        //handle gem connect here
        return;
      case EsupportedWallet.WALLETCONNECT:
        //walletconnect login here
        const userSelectedNetwork = EsupportedNewtworks[network as unknown as keyof typeof EsupportedNewtworks]
        let initializeWalletConnect = await createWalletConnectClient(projectId!)
        const proposalNamespace = {
          xrpl: {
            chains: [userSelectedNetwork.walletconnectId],
            methods: [EwalletConnectSupportedMethod.SINGLE_SIGN, EwalletConnectSupportedMethod.MULTI_SIG_SIGN],
            events: ["connect", "disconnect"],
          }
        }
        let initializeWCInstance = await initializeWalletConnect.connect({
          requiredNamespaces: proposalNamespace
        })
        this.Client = initializeWalletConnect
        return initializeWCInstance




      default:
        throw new Error("the wallet type you selected is not supported ")

    }
  }
  public async signTransaction(transaction: XRPL.TxRequest) {
    let walletType = this.selectedWallet
    switch (walletType) {
      case EsupportedWallet.WALLETCONNECT:
        return this.signWalletConnectTx(transaction)

      case EsupportedWallet.XUMM:
        return await signedXummTransaction(this.XummInstance, transaction)

      default:
        throw new Error("the wallet type you selected is not supported ")
    }

  }
} 